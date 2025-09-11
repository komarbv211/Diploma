using Core.DTOs.PaginationDTOs;
using Core.DTOs.ProductsDTO;
using Core.Models.Search;

namespace Core.Interfaces;

public interface IProductService
{
    Task<List<ProductItemDto>> GetProductsAsync();
    Task<ProductItemDto?> GetByIdAsync(long id);         
    Task<ProductItemDto> CreateProductAsync(ProductCreateDto dto);
    Task UpdateProductAsync(ProductUpdateDto dto);
    Task DeleteProductAsync(long id);
    Task SetProductPromotionAsync(ProductSetPromotionDto dto);
    Task<SearchResult<ProductItemModel>> SearchProductsAsync(ProductSearchModel model, bool isAdmin = false);
    Task<List<ProductItemDto>> GetProductsByCategoriesAsync(IEnumerable<long> categoryIds);
}
