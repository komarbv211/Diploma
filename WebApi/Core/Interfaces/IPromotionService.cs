using Core.DTOs.PromotionDTOs;

namespace Core.Interfaces
{
    public interface IPromotionService
    {
        Task CreatePromotionAsync(PromotionCreateDto dto);
        Task UpdatePromotionAsync(PromotionUpdateDto dto);
        Task DeletePromotionAsync(long id);
    }
}
