using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace WebApiDiploma.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController(ICategoryService categoryService) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await categoryService.GetCategoriesAsync();
            return Ok(categories);
        }
    }
}
