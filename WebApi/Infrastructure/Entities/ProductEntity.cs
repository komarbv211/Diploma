using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Infrastructure.Entities
{
    public class ProductEntity : BaseEntity<long>
    {
        [Required, StringLength(255)]
        public string Name { get; set; }
        public decimal Price { get; set; }
        //public string? Image { get; set; }

        [StringLength(4000)]
        public string? Description { get; set; }

        [ForeignKey("Category")]
        public long CategoryId { get; set; }

        [ForeignKey("Brand")]
        public long? BrandId { get; set; }

        // Додані властивості рейтингу 
        public long? RatingsCount { get; set; }
        public double? AverageRating { get; set; }

        public virtual CategoryEntity? Category { get; set; }

        public virtual BrandEntity? Brand { get; set; }

        // 🆕 Дата створення
        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;


        public virtual ICollection<ProductImageEntity>? Images { get; set; }

        // 🔗 Зв'язок з акціями (багато до багатьох)
        //public virtual ICollection<PromotionEntity>? Promotions { get; set; }

        public virtual ICollection<PromotionProductEntity>? PromotionProducts { get; set; }
        public virtual ICollection<ProductRatingEntity>? Ratings { get; set; }        
        public ICollection<CartEntity>? Carts { get; set; }
    }
}
