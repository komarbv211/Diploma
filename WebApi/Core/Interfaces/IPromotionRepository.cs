using Infrastructure.Entities;

namespace Core.Interfaces
{
    public interface IPromotionRepository : IRepository<PromotionEntity>
    {
        Task<PromotionEntity?> GetByIdWithProductsAsync(long id);
        Task<PromotionEntity?> GetByIdWithProductsAndDetailsAsync(long id);

        Task<List<PromotionEntity>> GetAllWithDetailsAsync();
    }
}
