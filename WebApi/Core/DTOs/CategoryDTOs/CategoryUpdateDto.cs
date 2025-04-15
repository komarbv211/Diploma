using System.ComponentModel.DataAnnotations;

namespace Core.DTOs.CategoryDTOs
{
    public class CategoryUpdateDto : CategoryCreateDto
    {
        [Required]
        public long Id { get; set; }
    }
}
