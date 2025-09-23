using AutoMapper;
using AutoMapper.QueryableExtensions;
using Core.DTOs.OrderDTOs;
using Core.Exceptions;
using Core.Interfaces;
using Core.Models.Enums;
using Infrastructure.Entities;
using Infrastructure.Enums;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using System.Net;

namespace Core.Services
{
    public class OrderService : IOrderService
    {
        private readonly IRepository<OrderEntity> _orderRepository;
        private readonly IRepository<OrderItemEntity> _orderItemRepository;
        private readonly IRepository<NovaPostWarehouseEntity> _warehouseRepository;
        private readonly IRepository<ProductEntity> _productRepository;
        private readonly IMapper _mapper;
        private readonly IAuthService _authService;
        private readonly IEmailService _emailService;

        public OrderService(
            IRepository<OrderEntity> orderRepository,
            IRepository<OrderItemEntity> orderItemRepository,
            IRepository<NovaPostWarehouseEntity> warehouseRepository,
            IRepository<ProductEntity> productRepository,
            IAuthService authService,
            IMapper mapper,
            IEmailService emailService)
        {
            _orderRepository = orderRepository;
            _orderItemRepository = orderItemRepository;
            _warehouseRepository = warehouseRepository;
            _productRepository = productRepository;
            _mapper = mapper;
            _authService = authService;
            _emailService = emailService;
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

        public async Task<List<OrderDto>> GetOrdersByUserIdAsync(long? userId = null)
        {
            var userIdFind = userId ?? await _authService.GetUserId();
            var result = await _orderRepository
                .GetAllQueryable()
                .Where(o => o.UserId == userIdFind)
                .Include(o => o.Items)
                .Include(o => o.Warehouse)
                .ProjectTo<OrderDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
            return result;
        }

        public async Task<List<OrderHistoryDto>> GetOrdersHistoryByUserIdAsync(long? userId = null)
        {
            var userIdFind = userId ?? await _authService.GetUserId();

            var orders = await _orderRepository
                .GetAllQueryable()
                .Where(o => o.UserId == userIdFind)
                .Include(o => o.Items)
                    .ThenInclude(i => i.Product)
                        .ThenInclude(p => p.Images)
                .OrderByDescending(o => o.DateCreated)
                .ProjectTo<OrderHistoryDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return orders;
        }

        public async Task<OrderDto> CreateOrderAsync(OrderCreateDto dto, long? userId = null)
        {
            if (dto == null)
                throw new HttpException("Неправильні дані замовлення", HttpStatusCode.BadRequest);

            var entity = _mapper.Map<OrderEntity>(dto);

            try
            {
                entity.UserId = userId == null ? await _authService.GetUserId() : userId.Value;
            }
            catch (Exception ex)
            {
                if (userId.HasValue)
                    entity.UserId = userId.Value;
            }

            var warehouse = await ValidateWarehouseAsync(dto.WarehouseId, dto.DeliveryType);
            if (warehouse != null)
                entity.WarehouseId = warehouse.Id;

            await _orderRepository.AddAsync(entity);
            await _orderRepository.SaveAsync();

            if (dto.Items.Any())
            {
                //entity.Items = _mapper.Map<List<OrderItemEntity>>(dto.Items);
                entity.Items = new List<OrderItemEntity>();
                foreach (var itemDto in dto.Items)
                {
                    var product = await _productRepository.GetByID(itemDto.ProductId);
                    if (product == null)
                        throw new HttpException($"Товар з id {itemDto.ProductId} не знайдено", HttpStatusCode.BadRequest);

                    var orderItem = _mapper.Map<OrderItemEntity>(itemDto);
                    orderItem.Price = product.Price;
                    orderItem.OrderId = entity.Id;
                    //await _orderItemRepository.AddAsync(orderItem);
                    //await _orderItemRepository.SaveAsync();
                    entity.Items.Add(orderItem);
                }

            }

            entity.TotalPrice = entity.Items?.Sum(i => i.Quantity * i.Price) ?? 0;
            entity.Status = OrderStatus.Pending;

            await _orderRepository.SaveAsync();

            if (!string.IsNullOrEmpty(dto.Email))
            {
                try
                {
                    await SendOrderConfirmationAsync(dto.Email, entity);
                }
                catch
                {
                    Console.WriteLine($"Не вдалося надіслати лист на {dto.Email}");
                }
            }

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

        public async Task UpdateOrderStatusAsync(OrderStatusUpdateDto dto)
        {
            var entity = await _orderRepository
                .GetAllQueryable()
                .FirstOrDefaultAsync(o => o.Id == dto.Id)
                ?? throw new HttpException("Замовлення не знайдено", HttpStatusCode.NotFound);

            entity.Status = dto.Status;
            entity.UpdatedAt = DateTime.UtcNow;

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
            order.IsDeleted = true;
            //_orderRepository.Delete(order);

            await _orderRepository.SaveAsync();
        }

        private async Task<NovaPostWarehouseEntity?> ValidateWarehouseAsync(long? warehouseId, DeliveryType deliveryType)
        {
            if (deliveryType == DeliveryType.NovaPoshta)
            {
                if (!warehouseId.HasValue)
                    throw new ArgumentException("Для доставки Новою Поштою потрібно обрати відділення.");

                var warehouse = await _warehouseRepository.GetByID(warehouseId.Value);
                if (warehouse == null)
                    throw new ArgumentException("Вибране відділення не знайдено.");

                return warehouse;
            }

            return null;
        }

        public async Task SendOrderConfirmationAsync(string email, OrderEntity order)
        {
            var templatePath = Path.Combine(Directory.GetCurrentDirectory(), "Templates", "OrderReceipt.html");
            var template = await File.ReadAllTextAsync(templatePath);

            var itemsHtml = string.Join("", order.Items.Select(item =>
                $"<tr>" +
                $"<td style='padding:8px; border-bottom:1px solid #eee;'>{item.Product?.Name ?? "Товар"}</td>" +
                $"<td style='padding:8px; border-bottom:1px solid #eee;' align='center'>{item.Quantity}</td>" +
                $"<td style='padding:8px; border-bottom:1px solid #eee;' align='right'>{item.Price} грн</td>" +
                $"</tr>"
            ));

            var body = template
                .Replace("{{username}}", email)
                .Replace("{{orderId}}", order.Id.ToString())
                .Replace("{{items}}", itemsHtml)
                .Replace("{{total}}", order.TotalPrice.ToString("F2"));

            try
            {
                await _emailService.SendEmailAsync(email, "Підтвердження замовлення", body);
            }
            catch
            {
                Console.WriteLine($"Не вдалося надіслати лист на {email}");
            }
        }
    }
}
