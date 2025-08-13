using Core.DTOs.ProductRatingDTOs;

namespace Core.Interfaces
{
    public interface IProductRatingService
    {
        Task<List<ProductRatingDto>> GetRatingsByProductIdAsync(long productId);
        Task<ProductRatingDto> AddOrUpdateRatingAsync(ProductRatingCreateDto dto);
        Task DeleteRatingAsync(long id);
    }
}
