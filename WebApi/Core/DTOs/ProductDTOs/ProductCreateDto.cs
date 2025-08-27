using Microsoft.AspNetCore.Http;

namespace Core.DTOs.ProductsDTO
{
    public class ProductCreateDto
    {
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string? Description { get; set; }
        public long CategoryId { get; set; }
        public long? BrandId { get; set; }
        public int Quantity { get; set; }
        public List <IFormFile>? image {  get; set; }
    }
}
