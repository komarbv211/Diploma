using Core.DTOs.CategoryDTOs;

namespace Core.Interfaces
{
    public interface ICategoryService
    {
        Task<List<CategoryDto>> GetCategoriesAsync();
        Task<List<CategoryNameDto>> GetCategoriesNamesAsync();
        Task<CategoryDto?> GetByIdAsync(long id);
        Task<CategoryDto?> GetBySlugAsync(string slug);
        Task<List<CategoryDto>> GetRootCategoriesAsync(); 
        Task<List<CategoryDto>> GetChildrenAsync(long parentId);
        Task CreateCategoryAsync(CategoryCreateDto dto);
        Task UpdateCategoryAsync(CategoryUpdateDto dto);
        Task DeleteCategoryAsync(long id);
    }
}
