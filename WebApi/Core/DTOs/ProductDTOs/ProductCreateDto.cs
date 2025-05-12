namespace Core.DTOs.ProductsDTO
{
    public class ProductCreateDto
    {
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string? Description { get; set; }
        public long CategoryId { get; set; }      
    }
}
