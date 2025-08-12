using Core.DTOs.CartDTOs;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApiDiploma.Controllers.User;

[Route("api/[controller]/[action]")]
[ApiController]
[Authorize]
public class CartController(ICartService cartService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> CreateUpdate([FromBody] CartCreateUpdateDTO model)
    {
        await cartService.CreateUpdate(model);
        return Ok();
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> AddRange([FromBody] List<CartCreateUpdateDTO> modelItems)
    {
        foreach (var item in modelItems)
        {
            await cartService.CreateUpdate(item);
        }
        return Ok();
    }

    [HttpGet]
    public async Task<IActionResult> GetCart()
    {
        var model = await cartService.GetCartItems();
        return Ok(model);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> RemoveCartItem(long id)
    {
        await cartService.Delete(id);
        return Ok();
    }
}