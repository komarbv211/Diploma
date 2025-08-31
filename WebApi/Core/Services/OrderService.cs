using AutoMapper;
using AutoMapper.QueryableExtensions;
using Core.DTOs.OrderDTOs;
using Core.Exceptions;
using Core.Interfaces;
using Infrastructure.Entities;
using Infrastructure.Enums;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace Core.Services
{
    public class OrderService : IOrderService
    {
        private readonly IRepository<OrderEntity> _orderRepository;
        private readonly IRepository<OrderItemEntity> _orderItemRepository;
        private readonly IRepository<NovaPostWarehouseEntity> _warehouseRepository;
        private readonly IMapper _mapper;

        public OrderService(
            IRepository<OrderEntity> orderRepository,
            IRepository<OrderItemEntity> orderItemRepository,
            IRepository<NovaPostWarehouseEntity> warehouseRepository,
            IMapper mapper)
        {
            _orderRepository = orderRepository;
            _orderItemRepository = orderItemRepository;
            _warehouseRepository = warehouseRepository;
            _mapper = mapper;
        }

        public async Task<List<OrderDto>> GetOrders()
        {
            return await _orderRepository
                .GetAllQueryable()
                .ProjectTo<OrderDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }

        public async Task<OrderDto?> GetOrderByIdAsync(long id)
        {
            var orderDto = await _orderRepository
              .GetAllQueryable()
              .Include(o => o.Warehouse)
              .Where(o => o.Id == id)
              .ProjectTo<OrderDto>(_mapper.ConfigurationProvider)
              .FirstOrDefaultAsync();

            return orderDto ?? throw new HttpException("Замовлення не знайдено", HttpStatusCode.NotFound);
        }

        public async Task<List<OrderDto>> GetOrdersByUserIdAsync(long userId)
        {
            return await _orderRepository
                .GetAllQueryable()
                .Where(o => o.UserId == userId)
                .Include(o => o.Items)
                .Include(o => o.Warehouse)
                .ProjectTo<OrderDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }

        public async Task<OrderDto> CreateOrderAsync(OrderCreateDto dto)
        {
            var warehouse = await ValidateWarehouseAsync(dto.WarehouseId, dto.DeliveryType, dto);

            var entity = _mapper.Map<OrderEntity>(dto);

            if (dto.Items.Any())
                entity.Items = _mapper.Map<List<OrderItemEntity>>(dto.Items);

            if (warehouse != null)
                entity.WarehouseId = warehouse.Id;

            await _orderRepository.AddAsync(entity);
            await _orderRepository.SaveAsync();

            return _mapper.Map<OrderDto>(entity);
        }

        public async Task UpdateOrderAsync(OrderUpdateDto dto)
        {
            var entity = await _orderRepository
                .GetAllQueryable()
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == dto.Id)
                ?? throw new HttpException("Замовлення не знайдено", HttpStatusCode.NotFound);

            var warehouse = await ValidateWarehouseAsync(dto.WarehouseId, dto.DeliveryType, dto);

            _mapper.Map(dto, entity);

            var newItems = _mapper.Map<List<OrderItemEntity>>(dto.Items);

            var itemsToRemove = entity.Items.Where(i => !newItems.Any(ni => ni.Id == i.Id)).ToList();
            _orderItemRepository.DeleteRange(itemsToRemove);

            var itemsToAdd = newItems.Where(ni => ni.Id == 0).ToList();
            foreach (var item in itemsToAdd)
                entity.Items.Add(item);

            await _orderRepository.Update(entity);
            await _orderRepository.SaveAsync();
        }

        public async Task DeleteOrderAsync(int orderId)
        {
            var order = await _orderRepository
                .GetAllQueryable()
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == orderId) ?? throw new KeyNotFoundException("Замовлення не знайдено");

            if (order.Items.Count != 0) _orderItemRepository.DeleteRange(order.Items);

            _orderRepository.Delete(order);

            await _orderRepository.SaveAsync();
        }

        private async Task<NovaPostWarehouseEntity?> ValidateWarehouseAsync(long? warehouseId, DeliveryType deliveryType, OrderCreateDto dto)
        {
            if (deliveryType == DeliveryType.NovaPoshta)
            {
                if (!warehouseId.HasValue)
                    throw new HttpException("Не вибрано відділення Нової пошти", HttpStatusCode.BadRequest);

                var warehouse = await _warehouseRepository.GetByID(warehouseId.Value);
                if (warehouse == null)
                    throw new HttpException("Відділення Нової пошти не знайдено", HttpStatusCode.BadRequest);

                return warehouse;
            }

            if (deliveryType == DeliveryType.Courier)
            {
                if (string.IsNullOrWhiteSpace(dto.Street) || string.IsNullOrWhiteSpace(dto.House))
                    throw new HttpException("Вулиця та будинок обов'язкові для кур'єрської доставки", HttpStatusCode.BadRequest);

                dto.DeliveryAddress = $"{dto.City}, {dto.Street} {dto.House}" +
                                      (string.IsNullOrWhiteSpace(dto.Apartment) ? "" : $", кв. {dto.Apartment}");

                return null;
            }

            return null;
        }

    }
}
