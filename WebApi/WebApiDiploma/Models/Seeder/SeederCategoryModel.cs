using Infrastructure.Entities;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace WebApiDiploma.Models.Seeder
{
    public class SeederCategoryModel
    {
        public string Name { get; init; } = string.Empty;
        public string? UrlSlug { get; set; }
        //public string? Image { get; init; }

        public int Priority { get; set; }
        public string? Description { get; set; }
        public long? ParentId { get; set; }

        public IEnumerable<SeederCategoryModel>? Children { get; init; }

        ////public IEnumerable<String>? Filters { get; init; }
        //public virtual CategoryEntity Parent { get; set; } = null!;
    }
}
