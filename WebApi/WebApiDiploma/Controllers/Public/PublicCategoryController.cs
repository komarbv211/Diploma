using Core.DTOs.CategoryDTOs;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace WebApiDiploma.Controllers.Public
{
    [Route("api/category")]
    [ApiController]
    public class PublicCategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public PublicCategoryController(ICategoryService categoryService)
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
