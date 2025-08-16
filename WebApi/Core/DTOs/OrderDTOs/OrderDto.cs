using Core.Models.Enums;
using Infrastructure.Enums;

namespace Core.DTOs.OrderDTOs
{
    public class OrderDto
    {
        public long Id { get; set; }
        public long UserId { get; set; }
        public long? WarehouseId { get; set; }
        public decimal TotalPrice { get; set; }
        public DeliveryType DeliveryType { get; set; }
        public PaymentMethod PaymentMethod { get; set; }
        public OrderStatus Status { get; set; }
        public string? DeliveryAddress { get; set; }
        public string? CustomerNote { get; set; }
        public string? TrackingNumber { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public List<OrderItemDto> Items { get; set; } = [];
        public NovaPostWarehouseDto? Warehouse { get; set; }
    }

    public class OrderCreateDto
    {
        public long UserId { get; set; }
        public long? WarehouseId { get; set; }
        public decimal TotalPrice { get; set; }
        public DeliveryType DeliveryType { get; set; }
        public PaymentMethod PaymentMethod { get; set; }
        public string? DeliveryAddress { get; set; }
        public string? CustomerNote { get; set; }
        public string? TrackingNumber { get; set; }
        public List<OrderItemCreateDto> Items { get; set; } = [];
    }

    public class OrderUpdateDto : OrderCreateDto
    {
        public long Id { get; set; }
        public OrderStatus Status { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
