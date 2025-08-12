using Core.DTOs.PromotionDTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface IPromotionService
    {
        Task CreatePromotionAsync(PromotionCreateDto dto);
        Task UpdatePromotionAsync(PromotionUpdateDto dto);
        Task DeletePromotionAsync(long id);

        Task<List<PromotionViewDto>> GetAllPromotionsAsync();
        Task<PromotionViewDto?> GetPromotionByIdAsync(long id);
    }
}
