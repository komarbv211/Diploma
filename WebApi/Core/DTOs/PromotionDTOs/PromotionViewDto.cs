namespace Core.DTOs.PromotionDTOs
{
    public class PromotionViewDto
    {
        public long Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        public string? ImageUrl { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public bool IsActive { get; set; }

        public long? CategoryId { get; set; }

        public string? CategoryName { get; set; }

        public long DiscountTypeId { get; set; }

        public string DiscountTypeName { get; set; } = string.Empty;

        public decimal DiscountAmount { get; set; }

        public List<long> ProductIds { get; set; } = new();
    }
}
