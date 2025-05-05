using Infrastructure.Entities;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace WebApiDiploma.Models.Seeder
{
    public class SeederProductModel
    {
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string? Image { get; set; }
        public string? Description { get; set; }
        public long CategoryId { get; set; }
        public virtual CategoryEntity? Category { get; set; }
        public virtual ICollection<ProductImageEntity>? Images { get; set; }
    }
}
