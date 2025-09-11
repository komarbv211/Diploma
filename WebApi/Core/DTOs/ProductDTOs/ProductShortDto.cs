using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.DTOs.ProductDTOs
{
    public class ProductShortDto
    {
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public List<ProductImageDto>? Images { get; set; }
    }
}
