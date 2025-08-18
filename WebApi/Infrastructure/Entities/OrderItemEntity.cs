using System.ComponentModel.DataAnnotations.Schema;

namespace Infrastructure.Entities
{
    public class OrderItemEntity : BaseEntity<long>
    {
        public long OrderId { get; set; }

        [ForeignKey(nameof(OrderId))]
        public virtual OrderEntity Order { get; set; }
        public required int ProductId { get; set; }
        public required string ProductName { get; set; }
        public required int Quantity { get; set; }
        public required decimal Price { get; set; }
    }
}
