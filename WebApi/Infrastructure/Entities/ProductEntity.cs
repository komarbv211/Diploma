using Infrastructure.Entities;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

public class ProductEntity : BaseEntity<long>
{
    [Required, StringLength(255)]
    public string Name { get; set; }
    public decimal Price { get; set; }

    [StringLength(4000)]
    public string? Description { get; set; }

    [ForeignKey("Category")]
    public long CategoryId { get; set; }
    public virtual CategoryEntity? Category { get; set; }
    
    [ForeignKey("Brand")]
    public long? BrandId { get; set; }

    public int Quantity { get; set; }

    public long? RatingsCount { get; set; }
    public double? AverageRating { get; set; }

    // 🔗 Зв’язок: багато продуктів можуть належати одній акції
    [ForeignKey("Promotion")]
    public long? PromotionId { get; set; }
    public virtual PromotionEntity? Promotion { get; set; }

    // Знижка у відсотках (опціонально)
    public decimal? DiscountPercent { get; set; }

    public virtual BrandEntity? Brand { get; set; }

    public virtual ICollection<ProductImageEntity>? Images { get; set; }
    public virtual ICollection<ProductRatingEntity>? Ratings { get; set; }
    public ICollection<CartEntity>? Carts { get; set; }
}
