using Infrastructure.Entities;

namespace Core.Interfaces
{
    public interface ICategoryRepository : IRepository<CategoryEntity>
    {
        Task<CategoryEntity?> GetBySlugAsync(string slug);
        Task<IEnumerable<CategoryEntity>> GetChildrenAsync(long parentId);
        Task<CategoryEntity?> GetCategoryWithChildrenAsync(long id);
        Task<IEnumerable<CategoryEntity>> GetRootCategoriesAsync();
        Task<CategoryEntity?> GetParentCategoryAsync(long categoryId);
    }
}
