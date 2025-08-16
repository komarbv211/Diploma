using AutoMapper;
using AutoMapper.QueryableExtensions;
using Core.DTOs.OrderDTOs;
using Core.Interfaces;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Json;

namespace Core.Services
{
    public class NovaPoshtaService
    {
        private readonly IRepository<NovaPostWarehouseEntity> _npRepository;
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly IMapper _mapper;

        public NovaPoshtaService(HttpClient httpClient, IConfiguration config, IRepository<NovaPostWarehouseEntity> npRepository, IMapper mapper)
        {
            _httpClient = httpClient;
            _npRepository = npRepository;
            _mapper = mapper;
            _apiKey = config["NovaPoshta:ApiKey"] ?? "";
        }

        public async Task<List<NovaPostWarehouseDto>> GetAllWarehousesAsync()
        {
            return await _npRepository.GetAllQueryable()
                .ProjectTo<NovaPostWarehouseDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }

        public async Task UpdateWarehousesAsync()
        {
            var request = new
            {
                apiKey = _apiKey,
                modelName = "AddressGeneral",
                calledMethod = "getWarehouses",
                methodProperties = new { }
            };

            var response = await _httpClient.PostAsJsonAsync("https://api.novaposhta.ua/v2.0/json/", request);
            response.EnsureSuccessStatusCode();

            var data = await response.Content.ReadFromJsonAsync<NovaPostWarehouseResponse>();

            if (data?.Data == null || !data.Data.Any())
            {
                Console.WriteLine("Не отримано жодного складу від Нової пошти.");
                return;
            }

            foreach (var w in data.Data)
            {
                var entity = await _npRepository.FirstOrDefaultAsync(x => x.WarehouseCode == w.Number);

                if (entity == null)
                {
                    var newEntity = _mapper.Map<NovaPostWarehouseEntity>(w);
                    MapExtraFields(newEntity, w);
                    await _npRepository.AddAsync(newEntity);

                    Console.WriteLine($"Склад {w.Description} ({w.Number}) додано");
                }
                else
                {
                    _mapper.Map(w, entity);
                    MapExtraFields(entity, w);
                    entity.LastSyncedAt = DateTime.UtcNow;

                    Console.WriteLine($"Склад {w.Description} ({w.Number}) оновлено");
                }
            }

            await _npRepository.SaveAsync();
        }
        private static void MapExtraFields(NovaPostWarehouseEntity entity, NovaPostWarehouseData w)
        {
            entity.Address = w.Description ?? string.Empty;
            entity.WorkingHours = w.Schedule != null
                ? string.Join(", ", w.Schedule.Select(s => $"{s.Key}:{s.Value}"))
                : string.Empty;
            entity.MaxWeightKg = decimal.TryParse(w.TotalMaxWeightAllowed, out var weight) ? weight : null;
            entity.Latitude = w.Latitude ?? 0;
            entity.Longitude = w.Longitude ?? 0;
        }
    }
}
