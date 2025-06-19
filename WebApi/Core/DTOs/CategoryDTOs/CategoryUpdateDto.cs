using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace Core.DTOs.CategoryDTOs
{
    public class CategoryUpdateDto 
    {        
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;

        public string? UrlSlug { get; set; }

        public int Priority { get; set; } = 0;

        public IFormFile? Image { get; set; }

        public string? Description { get; set; }

        public long? ParentId { get; set; }
    }
}
