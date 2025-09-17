using Core.DTOs.ProductDTOs;

public class ProductItemDto
{
    public long Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string? Description { get; set; }
    public long CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public long? BrandId { get; set; }
    public int Quantity { get; set; }
    public double? AverageRating { get; set; }
    public long RatingsCount { get; set; }
    public int CommentsCount { get; set; }
    public DateTime? CreatedDate { get; set; } = DateTime.UtcNow;
    public List<ProductImageDto>? Images { get; set; }

    // 🔗 Акція
    public long? PromotionId { get; set; }
    public decimal? DiscountPercent { get; set; }
    public decimal FinalPrice => DiscountPercent.HasValue
        ? Price - (Price * (DiscountPercent.Value / 100m))
        : Price;

    // 🆕 Нове поле
    public bool IsFavorite { get; set; } = false;
}
