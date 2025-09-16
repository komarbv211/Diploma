namespace Core.DTOs.OrderDTOs
{
    public class OrderItemDto
    {
        public long Id { get; set; }
        public long OrderId { get; set; }
        public long ProductId { get; set; }
        public long Quantity { get; set; }
        public decimal Price { get; set; }
    }

    public class OrderItemCreateDto
    {
        public long ProductId { get; set; }
        public long Quantity { get; set; }
        public decimal Price { get; set; }
    }

    public class OrderItemUpdateDto : OrderItemCreateDto
    {
        public long Id { get; set; }
    }

    public class OrderHistoryItemDto
    {
        public long Id { get; set; }
        public long OrderId { get; set; }
        public long ProductId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public long Quantity { get; set; }
        public decimal Price { get; set; }
    }
}
