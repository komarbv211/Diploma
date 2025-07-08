using Core.DTOs.PromotionDTOs;

namespace Core.Interfaces
{
    public interface IPromotionService
    {
        Task UpdatePromotionAsync(PromotionUpdateDto dto);
    }
}
