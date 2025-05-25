using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Infrastructure.Entities
{
    public class ProductImageEntity : BaseEntity<long>
    {
        [Required, StringLength(200)]
        public string Name { get; set; }
        //послідовність слідування фото у товарі
        public short Priority { get; set; }
        [ForeignKey("Product")]
        public long ProductId { get; set; }
        public virtual ProductEntity Product { get; set; } = null!;
    }
}
