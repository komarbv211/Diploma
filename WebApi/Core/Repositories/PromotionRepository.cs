using Core.Interfaces;
using Infrastructure.Data;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace Core.Repositories
{
    public class PromotionRepository : Repository<PromotionEntity>, IPromotionRepository
    {
        public PromotionRepository(DbMakeUpContext context) : base(context) { }

        // Отримати акцію з продуктами
        public async Task<PromotionEntity?> GetByIdWithProductsAsync(long id)
        {
            return await dbSet
                .Include(p => p.Products)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        // Отримати всі акції з деталями (категорії + продукти)
        public async Task<List<PromotionEntity>> GetAllWithDetailsAsync()
        {
            return await dbSet
                .Include(p => p.Products)
                .ToListAsync();
        }

        // Отримати одну акцію з продуктами і категорією
        public async Task<PromotionEntity?> GetByIdWithProductsAndDetailsAsync(long id)
        {
            return await dbSet
                .Include(p => p.Products)
                .FirstOrDefaultAsync(p => p.Id == id);
        }
    }
}
