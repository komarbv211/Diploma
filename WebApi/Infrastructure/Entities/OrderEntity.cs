using Core.Models.Enums;
using Infrastructure.Enums;

namespace Infrastructure.Entities
{
    public class OrderEntity : BaseEntity<long>
    {
        public required long UserId { get; set; }
        public virtual UserEntity? User { get; set; }

        public virtual ICollection<OrderItemEntity> Items { get; set; } = new List<OrderItemEntity>();
        public long? WarehouseId { get; set; }
        public virtual NovaPostWarehouseEntity? Warehouse { get; set; }

        public required decimal TotalPrice { get; set; }
        public required DeliveryType DeliveryMethod { get; set; }
        public required PaymentMethod PaymentMethod { get; set; }
        public required OrderStatus Status { get; set; } = OrderStatus.Pending;
        public string? DeliveryAddress { get; set; }
        public string? CustomerNote { get; set; }
        public string? TrackingNumber { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
