using Core.DTOs.CategoryDTOs;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace WebApiDiploma.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetAll()
        {
            var categories = await _categoryService.GetCategoriesAsync();
            return Ok(categories);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryDto>> GetById(long id)
        {
            var category = await _categoryService.GetByIdAsync(id);
            if (category == null)
                return NotFound();

            return Ok(category);
        }

        [HttpPost]
        public async Task<ActionResult> Create([FromBody] CategoryCreateDto dto)
        {
            await _categoryService.CreateCategoryAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = dto.Name }, dto); 
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(long id, [FromBody] CategoryUpdateDto dto)
        {
            if (id != dto.Id)
                return BadRequest("ID категорії не співпадає.");

            await _categoryService.UpdateCategoryAsync(dto);
            return NoContent(); 
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(long id)
        {
            await _categoryService.DeleteCategoryAsync(id);
            return NoContent(); 
        }
    }
}
