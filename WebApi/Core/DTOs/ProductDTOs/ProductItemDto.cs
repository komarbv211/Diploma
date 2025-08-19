using Core.DTOs.ProductDTOs;

namespace Core.DTOs.ProductsDTO
{
    public class ProductItemDto
    {
        public long Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public string? Description { get; set; }

        public long CategoryId { get; set; }

        public int Quantity { get; set; }

        public double? AverageRating { get; set; }

        public long RatingsCount { get; set; }

        public List<ProductImageDto>? Images { get; set; }

        // 🔗 Опціональне поле: акція, до якої належить продукт
        public long? PromotionId { get; set; }

        // Відсоток знижки (якщо є)
        public decimal? DiscountPercent { get; set; }

        // Розрахована ціна зі знижкою (тільки для зручності відображення на клієнті)
        public decimal FinalPrice => DiscountPercent.HasValue
            ? Price - (Price * (DiscountPercent.Value / 100m))
            : Price;
    }
}
