using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Infrastructure.Entities
{
    public class ProductRatingEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Range(1, 5)]
        public int Rating { get; set; }

        [ForeignKey(nameof(Product))]
        public long ProductId { get; set; }
        public virtual ProductEntity Product { get; set; } = null!;

        [ForeignKey(nameof(User))]
        public long UserId { get; set; }
        public virtual UserEntity User { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
