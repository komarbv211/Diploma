using Core.Services;
using Infrastructure.Entities;
using Infrastructure.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        // Інжекція залежності для CategoryService
        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        // Отримати всі категорії
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryEntity>>> GetCategories()
        {
            var categories = await _categoryService.GetAllCategories();
            return Ok(categories);
        }

        // Отримати категорію за ID
        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryEntity>> GetCategory(long id)
        {
            var category = await _categoryService.GetCategoryById(id);
            if (category == null)
            {
                return NotFound();  
            }
            return Ok(category);
        }

        // Створити нову категорію
        [HttpPost]
        public async Task<ActionResult<CategoryEntity>> CreateCategory([FromBody] CategoryEntity category)
        {
            if (category == null)
            {
                return BadRequest("Категорія не може бути порожньою");
            }

            await _categoryService.AddCategory(category);
            return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, category);
        }

        // Оновити категорію
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(long id, [FromBody] CategoryEntity category)
        {
            if (id != category.Id)
            {
                return BadRequest("ID категорії не збігається");
            }

            var existingCategory = await _categoryService.GetCategoryById(id);
            if (existingCategory == null)
            {
                return NotFound();
            }

            await _categoryService.UpdateCategory(category);
            return NoContent();  
        }

        // Видалити категорію
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(long id)
        {
            var existingCategory = await _categoryService.GetCategoryById(id);
            if (existingCategory == null)
            {
                return NotFound();
            }

            await _categoryService.DeleteCategory(id);
            return NoContent();  
        }

        // Отримати батьківську категорію
        [HttpGet("{id}/parent")]
        public async Task<ActionResult<CategoryEntity>> GetParentCategory(long id)
        {
            var parentCategory = await _categoryService.GetParentCategoryAsync(id);
            if (parentCategory == null)
            {
                return NotFound();
            }
            return Ok(parentCategory);
        }
    }
}
