using Core.DTOs.ProductRatingDTOs;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
namespace WebApiDiploma.Controllers.Public;

[ApiController]
[Route("api/[controller]")]
public class ProductRatingController : ControllerBase
{
    private readonly IProductRatingService _ratingService;

    public ProductRatingController(IProductRatingService ratingService)
    {
        _ratingService = ratingService;
    }

    [HttpGet("{productId}")]
    public async Task<IActionResult> GetRatingsByProductId(long productId)
    {
        var ratings = await _ratingService.GetRatingsByProductIdAsync(productId);
        return Ok(ratings);
    }

    [HttpPost]
    public async Task<IActionResult> AddOrUpdateRating([FromBody] ProductRatingCreateDto dto)
    {
        var rating = await _ratingService.AddOrUpdateRatingAsync(dto);
        return Ok(rating);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRating(long id)
    {
        await _ratingService.DeleteRatingAsync(id);
        return NoContent();
    }
}
