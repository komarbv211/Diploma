using System.ComponentModel.DataAnnotations;

public class ProductSetPromotionDto
{
    [Required]
    public long ProductId { get; set; } // Ідентифікатор продукту

    public long? PromotionId { get; set; } // Ідентифікатор акції, до якої прив'язуємо продукт

    [Range(0, 100)]
    public decimal? DiscountPercent { get; set; } // Знижка у відсотках (опційно)
}
