using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace WebApiDiploma.Controllers.Public;

[ApiController]
[Route("api/promotion")]
public class PublicPromotionController : ControllerBase
{
    private readonly IPromotionService _promotionService;

    public PublicPromotionController(IPromotionService promotionService)
    {
        _promotionService = promotionService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var promotions = await _promotionService.GetAllPromotionsAsync();
        return Ok(promotions);
    }

    [HttpGet("{id:long}")]
    public async Task<IActionResult> GetById(long id)
    {
        if (id < 0) return BadRequest("Невірний ID");

        var promotion = await _promotionService.GetPromotionByIdAsync(id);
        if (promotion == null)
            return NotFound("Акція не знайдена");

        return Ok(promotion);
    }

}
