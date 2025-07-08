using Infrastructure.Entities;

namespace Core.Interfaces
{
    public interface IPromotionRepository : IRepository<PromotionEntity>
    {
        Task<PromotionEntity?> GetByIdWithProductsAsync(long id);
    }
}
