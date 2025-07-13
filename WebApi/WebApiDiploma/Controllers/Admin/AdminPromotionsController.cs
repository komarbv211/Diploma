using Core.DTOs.PromotionDTOs;
using Core.Interfaces;
using Infrastructure.Migrations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApiDiploma.Controllers.Admin
{
    [Authorize(Roles = "Admin")]
    [Route("api/admin/promotion")]
    [ApiController]
    public class AdminPromotionsController : ControllerBase
    {
        private readonly IPromotionService _promotionService;

        public AdminPromotionsController(IPromotionService promotionService)
        {
            _promotionService = promotionService;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] PromotionCreateDto dto)
        {
            await _promotionService.CreatePromotionAsync(dto);
            return Ok(new { message = "Акція створена" });
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromForm] PromotionUpdateDto dto)
        {
            if (dto.Id < 0) return BadRequest("Невірний ID");

            await _promotionService.UpdatePromotionAsync(dto);
            return NoContent();
        }

        [HttpDelete("{id:long}")]
        public async Task<IActionResult> Delete(long id)
        {
            if (id < 0) return BadRequest("Невірний ID");

            await _promotionService.DeletePromotionAsync(id);
            return Ok(new { message = "Акція видалена" });
        }
    }
}
