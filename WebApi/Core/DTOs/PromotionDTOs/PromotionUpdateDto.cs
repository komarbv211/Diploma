using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace Core.DTOs.PromotionDTOs
{
    public class PromotionUpdateDto
    {
        public long Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        public IFormFile? Image { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        public bool IsActive { get; set; } = true;

        public long? CategoryId { get; set; }

        [Required]
        public long DiscountTypeId { get; set; }

        public List<long>? ProductIds { get; set; }
    }
}
