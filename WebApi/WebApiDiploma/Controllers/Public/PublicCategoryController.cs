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
    }
}
