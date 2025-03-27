using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.DTOs.CategoryDTOs
{
    public class CategoryDto
    {
        public long Id { get; set; }
        public string? Name { get; set; }
        public string? UrlSlug { get; set; }
        public int Priority { get; set; }
        public string? Image { get; set; }
        public string? Description { get; set; }
        public long? ParentId { get; set; }
        public List<CategoryDto> Children { get; set; } = [];
    }
}
