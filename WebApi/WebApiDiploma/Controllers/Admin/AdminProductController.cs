using Core.DTOs.ProductsDTO;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApiDiploma.Controllers.Admin;

[ApiController]
[Route("api/admin/product")]
[Authorize(Roles = "Admin")]
public class AdminProductController : ControllerBase
{
    private readonly IProductService _productService;

    public AdminProductController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromForm] ProductCreateDto dto)
    {
        await _productService.CreateProductAsync(dto);
        return Ok();
    }

    [HttpPut]
    public async Task<IActionResult> Update([FromForm] ProductUpdateDto dto)
    {
        await _productService.UpdateProductAsync(dto);
        return Ok();
    }


    [HttpDelete("{id:long}")]
    public async Task<IActionResult> Delete(long id)
    {
        await _productService.DeleteProductAsync(id);
        return Ok();
    }
}
