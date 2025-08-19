using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models.Search
{
    public class ProductItemModel
    {
        public long Id { get; set; }
        public string Name { get; set; } = default!;
        public decimal Price { get; set; }
        public double? Rating { get; set; }
        public string? ImageUrl { get; set; }
        public string? BrandName { get; set; }
        public string? CategoryName { get; set; }
    }
}
