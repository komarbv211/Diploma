using System.ComponentModel.DataAnnotations.Schema;

namespace Infrastructure.Entities
{
    public class OrderItemEntity : BaseEntity<long>
    {
        public long OrderId { get; set; }
        public required virtual OrderEntity Order { get; set; }
        public long ProductId { get; set; }
        public required virtual ProductEntity Product { get; set; }
        public required int Quantity { get; set; }
        public required decimal Price { get; set; }
    }
}
