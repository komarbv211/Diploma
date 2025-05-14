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
        public List<ProductImageDto>? Images { get; set; }
    }
}
