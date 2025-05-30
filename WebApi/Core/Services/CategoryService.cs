using AutoMapper;
using Core.DTOs.CategoryDTOs;
using Core.Interfaces;
using Infrastructure.Entities;

namespace Core.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMapper _mapper;
        private readonly IImageService _imageService;

        public CategoryService(ICategoryRepository categoryRepository, IMapper mapper, IImageService imageService)
        {
            _categoryRepository = categoryRepository;
            _mapper = mapper;
            _imageService = imageService;
        }

        // Отримати всі категорії
        public async Task<List<CategoryDto>> GetCategoriesAsync()
        {
            var categories = await _categoryRepository.GetAllAsync();
            return _mapper.Map<List<CategoryDto>>(categories);
        }

        // Отримати категорію по ID
        public async Task<CategoryDto?> GetByIdAsync(long id)
        {
            var category = await _categoryRepository.GetByID(id);
            return category == null ? null : _mapper.Map<CategoryDto>(category);
        }

        // Отримати категорію по слузі
        public async Task<CategoryDto?> GetBySlugAsync(string slug)
        {
            var category = await _categoryRepository.GetBySlugAsync(slug);
            return category == null ? null : _mapper.Map<CategoryDto>(category);
        }

        // Отримати корінні категорії
        public async Task<List<CategoryDto>> GetRootCategoriesAsync()
        {
            var categories = await _categoryRepository.GetRootCategoriesAsync();
            return _mapper.Map<List<CategoryDto>>(categories);
        }

        // Отримати категорії за батьківським ID
        public async Task<List<CategoryDto>> GetChildrenAsync(long parentId)
        {
            var categories = await _categoryRepository.GetChildrenAsync(parentId);
            return _mapper.Map<List<CategoryDto>>(categories);
        }

        // Створення нової категорії       
        public async Task CreateCategoryAsync(CategoryCreateDto dto)
        {
            var category = _mapper.Map<CategoryEntity>(dto);

            if (dto.Image != null && dto.Image.Length > 0)
            {
                var fileName = await _imageService.SaveImageAsync(dto.Image);
                category.Image = fileName; 
            }

            await _categoryRepository.Insert(category);
            await _categoryRepository.SaveAsync();
        }


        // Оновлення існуючої категорії       
        public async Task UpdateCategoryAsync(CategoryUpdateDto dto)
        {
            var category = await _categoryRepository.GetByID(dto.Id);
            if (category == null) return;

            string imageName = category.Image!;

            _mapper.Map(dto, category);

            if (dto.Image != null)
            {
                // Видалити старе зображення
                if (!string.IsNullOrEmpty(imageName))
                    _imageService.DeleteImageIfExists(imageName);

                // Зберегти нове
                var newFileName = await _imageService.SaveImageAsync(dto.Image);
                category.Image = newFileName;
            }
            await _categoryRepository.Update(category);
            await _categoryRepository.SaveAsync();
        }

        // Видалення категорії        
        public async Task DeleteCategoryAsync(long id)
        {
            var category = await _categoryRepository.GetByID(id);
            if (category != null)
            {
                // Видалити зображення, якщо воно існує
                if (!string.IsNullOrEmpty(category.Image))
                {
                    _imageService.DeleteImageIfExists(category.Image);
                }

                await _categoryRepository.DeleteAsync(id);
                await _categoryRepository.SaveAsync();
            }
        }

    }
}
