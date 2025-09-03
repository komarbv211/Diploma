using AutoMapper;
using AutoMapper.QueryableExtensions;
using Core.DTOs.OrderDTOs;
using Core.Exceptions;
using Core.Interfaces;
using Core.Models.Enums;
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

        public async Task<OrderDto> CreateOrderAsync(OrderCreateDto dto, long? userId)
        {

            var warehouse = await ValidateWarehouseAsync(dto.WarehouseId, dto.DeliveryType);

            var entity = _mapper.Map<OrderEntity>(dto);
            if (userId.HasValue)
                entity.UserId = userId.Value;


            if (dto.Items.Any())
                entity.Items = _mapper.Map<List<OrderItemEntity>>(dto.Items);

            if (warehouse != null)
                entity.WarehouseId = warehouse.Id;

            entity.TotalPrice = entity.Items?.Sum(i => i.Quantity * i.Price) ?? 0;
            entity.Status = OrderStatus.Pending;

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
            entity.TotalPrice = entity.Items.Sum(i => i.Quantity * i.Price);

            var warehouse = await ValidateWarehouseAsync(dto.WarehouseId, dto.DeliveryType);

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

        public async Task DeleteOrderAsync(long orderId)
        {
            var order = await _orderRepository
                .GetAllQueryable()
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == orderId) ?? throw new KeyNotFoundException("Замовлення не знайдено");

            if (order.Items.Count != 0) _orderItemRepository.DeleteRange(order.Items);

            _orderRepository.Delete(order);

            await _orderRepository.SaveAsync();
        }

        private async Task<NovaPostWarehouseEntity?> ValidateWarehouseAsync(long? warehouseId, DeliveryType deliveryType)
        {
            if (deliveryType == DeliveryType.NovaPoshta && warehouseId.HasValue)
            {
                var warehouse = await _warehouseRepository.GetByID(warehouseId.Value);
                if (warehouse == null)
                    throw new HttpException("Відділення Нової пошти не знайдено", HttpStatusCode.BadRequest);

                return warehouse;
            }
            return null;
        }
    }
}
