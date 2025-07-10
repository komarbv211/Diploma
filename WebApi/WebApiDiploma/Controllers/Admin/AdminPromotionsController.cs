using Core.DTOs.PromotionDTOs;
using Core.Interfaces;
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

        [HttpPut]
        public async Task<IActionResult> Update([FromForm] PromotionUpdateDto dto)
        {
            if (dto.Id < 0) return BadRequest("Невірний ID");

            await _promotionService.UpdatePromotionAsync(dto);
            return NoContent();
        }
    }
}
