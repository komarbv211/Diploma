using Core.DTOs.FavoriteDTOs;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApiDiploma.Controllers.User;

[Route("api/[controller]/[action]")]
[ApiController]
[Authorize]
public class FavoriteController(IFavoriteService favoriteService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Add([FromBody] FavoriteCreateDTO model)
    {
        await favoriteService.Add(model);
        return Ok(new { message = "Added to favorites" });
    }

    [HttpPost]
    public async Task<IActionResult> AddRange([FromBody] List<FavoriteCreateDTO> modelItems)
    {
        foreach (var item in modelItems)
        {
            await favoriteService.Add(item);
        }

        return Ok(new { message = "Favorites added successfully" });
    }

    [HttpGet]
    public async Task<IActionResult> GetFavorites()
    {
        var model = await favoriteService.GetFavorites();
        return Ok(model);
    }

    [HttpDelete("{productId}")]
    public async Task<IActionResult> Remove(long productId)
    {
        await favoriteService.Delete(productId);
        return Ok(new { message = "Removed from favorites" });
    }

    [HttpDelete]
    public async Task<IActionResult> ClearFavorites()
    {
        await favoriteService.ClearFavorites();
        return Ok(new { message = "Favorites cleared successfully" });
    }
}
