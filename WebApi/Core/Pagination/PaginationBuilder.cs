using Core.DTOs.PaginationDTOs;
using Microsoft.EntityFrameworkCore;

namespace WebApiDiploma.Pagination
{
    public class PaginationBuilder<TEntity>(IQueryable<TEntity> query) where TEntity : class
    {
        public async Task<PagedResultDto<TEntity>> GetPageAsync(int page, int pageSize)
        {
            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResultDto<TEntity>(page, pageSize, totalCount, items);
        }
    }
}
