using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.DTOs.CategoryDTOs
{
    public class CategoryTranslationDto
    {
        public string Language { get; set; } = null!;
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
}
