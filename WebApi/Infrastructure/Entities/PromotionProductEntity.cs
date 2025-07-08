using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Entities
{
    public class PromotionProductEntity : BaseEntity<long>
    {
        [Required, ForeignKey("Promotion")]
        public long PromotionId { get; set; }
        public virtual PromotionEntity Promotion { get; set; }

        [Required, ForeignKey("Product")]
        public long ProductId { get; set; }
        public virtual ProductEntity Product { get; set; }
    }
}
