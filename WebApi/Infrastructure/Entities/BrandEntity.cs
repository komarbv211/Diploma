using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Entities
{
    public class BrandEntity : BaseEntity<long>
    {
      [Required, StringLength(200)]
      public string Name { get; set; } = string.Empty;


      public virtual ICollection<ProductEntity>? Products { get; set; }
    }
}
