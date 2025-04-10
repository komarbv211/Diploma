using Infrastructure.Entities;
using System.Threading.Tasks;

namespace Infrastructure.Interfaces
{
    public interface IRepositoryCategory : IRepository<CategoryEntity, long>
    {
        Task<CategoryEntity?> GetParentAsync(long categoryId); 
        Task<IEnumerable<CategoryEntity>> GetByParentIdAsync(long parentId); 
    }
}