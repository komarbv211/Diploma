using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Entities
{
    public class ProductEntity : BaseEntity<long>
    {
        [Required, StringLength(255)]
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string? Image { get; set; }

        [StringLength(4000)]
        public string? Description { get; set; }
        //[ForeignKey("Category")]
        //public long CategoryId { get; set; }
        //public virtual CategoryEntity? Category { get; set; }

        public virtual ICollection<ProductImageEntity>? Images { get; set; }
     
    }
}
