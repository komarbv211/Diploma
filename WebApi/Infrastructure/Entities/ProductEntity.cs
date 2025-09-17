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

    public int RatingsCount { get; set; } = 0;

    public double? AverageRating { get; set; }

    [ForeignKey("Promotion")]
    public long? PromotionId { get; set; }
    public virtual PromotionEntity? Promotion { get; set; }

    public decimal? DiscountPercent { get; set; }

    public virtual BrandEntity? Brand { get; set; }

    public virtual ICollection<ProductImageEntity>? Images { get; set; }
    public virtual ICollection<ProductRatingEntity>? Ratings { get; set; }
    public ICollection<CartEntity>? Carts { get; set; }
    public virtual ICollection<CommentEntity>? Comments { get; set; }

    public ICollection<FavoriteEntity>? Favorites { get; set; }
}
