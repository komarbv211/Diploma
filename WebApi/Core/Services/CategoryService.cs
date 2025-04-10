using Infrastructure.Interfaces;
using Infrastructure.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Core.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly IRepositoryCategory _categoryRepository;

        public CategoryService(IRepositoryCategory categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<CategoryEntity?> GetCategoryById(long id)
        {
            return await _categoryRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<CategoryEntity>> GetAllCategories()
        {
            return await _categoryRepository.GetAllAsync();
        }

        public async Task AddCategory(CategoryEntity category)
        {
            await _categoryRepository.AddAsync(category);
        }

        public async Task UpdateCategory(CategoryEntity category)
        {
            await _categoryRepository.UpdateAsync(category);
        }

        public async Task DeleteCategory(long id)
        {
            await _categoryRepository.DeleteAsync(id);
        }

        public async Task<CategoryEntity?> GetParentCategoryAsync(long categoryId)
        {
            return await _categoryRepository.GetParentAsync(categoryId);
        }

        public Task<IEnumerable<CategoryEntity>> GetByParentIdAsync(long parentId)
        {
            return _categoryRepository.GetByParentIdAsync(parentId);
        }
    }
}
