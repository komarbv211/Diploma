using Core.DTOs.BrandsDTOs;
using Core.DTOs.CategoryDTOs;
using Core.Interfaces;
using Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApiDiploma.Controllers.Admin
{
        [Authorize(Roles = "Admin")]
        [ApiController]
        [Route("api/admin/brand")]
    public class AdminBrandController : Controller
    {
             private readonly IBrandService _brandService;
        public AdminBrandController(IBrandService brandService)
        {
            _brandService = brandService;
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<BrandItemDto>> GetById(long id)
        {
            var brand = await _brandService.GetByIdAsync(id);
            if (brand == null)
                return NotFound();

            return Ok(brand);
        }

        [HttpPost]
        public async Task<ActionResult> Create([FromForm] BrandCreateDto dto)
        {
            await _brandService.CreateBrandAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = dto.Name }, dto);
        }

        [HttpPut]
        public async Task<ActionResult> Update([FromForm] BrandUpdateDto dto)
        {
            await _brandService.UpdateBrandAsync(dto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(long id)
        {
            await _brandService.DeleteBrandAsync(id);
            return NoContent();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BrandItemDto>>> GetAll()
        {
            var brand = await _brandService.GetBrandsAsync();
            return Ok(brand);
        }
    }
}
