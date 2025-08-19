using Core.DTOs.BrandsDTOs;
using Core.DTOs.CategoryDTOs;
using Core.Interfaces;
using Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace WebApiDiploma.Controllers.Public
{
    [Route("api/brand")]
    [ApiController]
    public class PublicBrandController : Controller
    {
        private readonly IBrandService _brandService;
        public PublicBrandController(IBrandService brandService)
        {
            _brandService = brandService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BrandItemDto>>> GetAll()
        {
            var brands = await _brandService.GetBrandsAsync();
            return Ok(brands);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BrandItemDto>> GetById(long id)
        {
            var brand = await _brandService.GetByIdAsync(id);
            if (brand == null)
                return NotFound();

            return Ok(brand);
        }


        //[HttpGet("names")]
        //public async Task<ActionResult<IEnumerable<CategoryNameDto>>> GetCategoryNames()
        //{
        //    var names = await _categoryService.GetCategoriesNamesAsync();
        //    return Ok(names);
        //}

       
    }
}
