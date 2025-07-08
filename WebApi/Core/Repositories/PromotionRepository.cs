using Core.Interfaces;
using Infrastructure.Data;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace Core.Repositories;
public class PromotionRepository : Repository<PromotionEntity>, IPromotionRepository
    {
        public PromotionRepository(DbMakeUpContext context) : base(context) { }

        public async Task<PromotionEntity?> GetByIdWithProductsAsync(long id)
        {
            return await dbSet
                .Include(p => p.PromotionProducts)
                .FirstOrDefaultAsync(p => p.Id == id);
        }
    }

