using Infrastructure.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infrastructure.Interfaces
{
    public interface ICategoryService
    {
        Task<CategoryEntity?> GetCategoryById(long id);
        Task<IEnumerable<CategoryEntity>> GetAllCategories();
        Task AddCategory(CategoryEntity category);
        Task UpdateCategory(CategoryEntity category);
        Task DeleteCategory(long id);


        Task<CategoryEntity?> GetParentCategoryAsync(long categoryId); 
        Task<IEnumerable<CategoryEntity>> GetByParentIdAsync(long parentId); 
    }
}
