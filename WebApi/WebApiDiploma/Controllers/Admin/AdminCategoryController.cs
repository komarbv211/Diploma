using Core.DTOs.CategoryDTOs;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApiDiploma.Controllers.Admin
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/admin/category")]
    public class AdminCategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public AdminCategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
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
        public async Task<ActionResult> Create([FromForm] CategoryCreateDto dto)
        {
            await _categoryService.CreateCategoryAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = dto.Name }, dto);
        }

        [HttpPut]
        public async Task<ActionResult> Update([FromForm] CategoryUpdateDto dto)
        {
            await _categoryService.UpdateCategoryAsync(dto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(long id)
        {
            await _categoryService.DeleteCategoryAsync(id);
            return NoContent();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetAll()
        {
            var categories = await _categoryService.GetCategoriesAsync();
            return Ok(categories);
        }
        [HttpGet("root")]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetRootCategories()
        {
            var categories = await _categoryService.GetRootCategoriesAsync();
            return Ok(categories);
        }

        [HttpGet("names")]
        public async Task<ActionResult<IEnumerable<CategoryNameDto>>> GetCategoryNames()
        {
            var names = await _categoryService.GetCategoriesNamesAsync();
            return Ok(names);
        }

        [HttpGet("children/{id}")]
        public async Task<ActionResult<CategoryDto>> GetChildrenById(long id)
        {
            var category = await _categoryService.GetChildrenAsync(id);
            if (category == null)
                return NotFound();

            return Ok(category);
        }
    }
}