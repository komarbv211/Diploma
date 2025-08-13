using Core.Interfaces;
using Infrastructure.Data;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace Core.Repositories
{
    public class PromotionRepository : Repository<PromotionEntity>, IPromotionRepository
    {
        public PromotionRepository(DbMakeUpContext context) : base(context) { }

        public async Task<PromotionEntity?> GetByIdWithProductsAsync(long id)
        {
            return await dbSet
                .Include(p => p.PromotionProducts)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<List<PromotionEntity>> GetAllWithDetailsAsync()
        {
            var promotions = await dbSet
    .Include(p => p.Category)
    .Include(p => p.DiscountType)
    .Include(p => p.PromotionProducts)
        .ThenInclude(pp => pp.Product)
    .ToListAsync();

            return promotions;

        }

        public async Task<PromotionEntity?> GetByIdWithProductsAndDetailsAsync(long id)
        {
            return await dbSet
                .Include(p => p.Category)
                .Include(p => p.DiscountType)
                .Include(p => p.PromotionProducts)
                .FirstOrDefaultAsync(p => p.Id == id);
        }
    }
}
