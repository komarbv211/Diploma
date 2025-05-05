using Core.DTOs.ProductsDTO;

namespace Core.Interfaces;

public interface IProductService
{
    Task<List<ProductItemDto>> GetProductsAsync();
    Task<ProductItemDto?> GetByIdAsync(long id);         
    Task CreateProductAsync(ProductCreateDto dto);
    Task UpdateProductAsync(ProductUpdateDto dto);
    Task DeleteProductAsync(long id);
}
