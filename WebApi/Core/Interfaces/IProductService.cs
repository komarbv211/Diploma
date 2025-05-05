using Core.DTOs.ProductsDTO;

namespace Core.Interfaces;

internal interface IProductService
{
    Task<List<ProductItemDto>> GetProductsAsync();
    Task<ProductItemDto?> GetByIdAsync(long id);
    Task<ProductItemDto?> GetBySlugAsync(string slug);       
    Task CreateProductAsync(ProductCreateDto dto);
    Task UpdateProductAsync(ProductUpdateDto dto);
    Task DeleteProductAsync(long id);
}
