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

        public async Task<List<NovaPostWarehouseDto>> GetAllWarehousesAsync(string cityRef)
        {
            return await _npRepository.GetAllQueryable()
                .ProjectTo<NovaPostWarehouseDto>(_mapper.ConfigurationProvider)
                .Where(x => x.CityRef == cityRef)   
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

            var existingWarehouses = await _npRepository.GetAllQueryable()
                .AsNoTracking()
                .GroupBy(x => x.WarehouseCode)
                .ToDictionaryAsync(g => g.Key, g => g.First());

            var apiCodes = data.Data.Select(w => w.Number).ToHashSet();

            foreach (var w in data.Data)
            {
                if (!existingWarehouses.TryGetValue(w.Number, out var entity))
                {
                    var newEntity = _mapper.Map<NovaPostWarehouseEntity>(w);
                    MapExtraFields(newEntity, w);
                    newEntity.LastSyncedAt = DateTime.UtcNow;
                    await _npRepository.AddAsync(newEntity);

                    Console.WriteLine($"Склад {w.Description} ({w.Number}) додано");
                }
                else
                {
                    entity.IsActive = true;
                    entity.LastSyncedAt = DateTime.UtcNow;
                    MapExtraFields(entity, w);
                    await _npRepository.Update(entity);

                    Console.WriteLine($"Склад {w.Description} ({w.Number}) оновлено");
                }
            }

            var toDeactivate = existingWarehouses.Values
                .Where(x => !apiCodes.Contains(x.WarehouseCode) && x.IsActive)
                .ToList();

            foreach (var w in toDeactivate)
            {
                w.IsActive = false;
                await _npRepository.Update(w);
                Console.WriteLine($"Склад {w.Address} ({w.WarehouseCode}) деактивовано");
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
            entity.CityRef = w.CityRef ?? string.Empty;
            entity.City = w.CityDescription ?? string.Empty;
        }
    }
}
