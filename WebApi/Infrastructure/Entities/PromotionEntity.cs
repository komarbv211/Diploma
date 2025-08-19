using Infrastructure.Entities;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

public class PromotionEntity : BaseEntity<long>
{
    [Required, StringLength(255)]
    public string Name { get; set; }

    [StringLength(4000)]
    public string? Description { get; set; }

    [Required]
    public string? Image { get; set; }

    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }

    public bool IsActive { get; set; } = true;

    public virtual ICollection<ProductEntity>? Products { get; set; }
}
