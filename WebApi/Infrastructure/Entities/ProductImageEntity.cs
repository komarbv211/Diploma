using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Entities
{
    public class ProductImageEntity : BaseEntity<long>
    {
        [Required, StringLength(200)]
        public string NamePhoto { get; set; }
        //послідовність слідування фото у товарі
        public short Priority { get; set; }
        [ForeignKey("Product")]
        public long ProductId { get; set; }
        public virtual ProductEntity Products { get; set; } = null!;
    }
}
