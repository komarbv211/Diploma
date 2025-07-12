using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace Core.DTOs.PromotionDTOs
{
    public class PromotionCreateDto
    {
        [Required, StringLength(255)]
        public string Name { get; set; }

        [StringLength(4000)]
        public string? Description { get; set; }

        [Required]
        public IFormFile Image { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        public bool IsActive { get; set; } = true;

        public long? CategoryId { get; set; }

        public long DiscountTypeId { get; set; }

        public List<long>? ProductIds { get; set; } 
    }
}
