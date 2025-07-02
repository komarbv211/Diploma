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

    [HttpGet]
    public async Task<ActionResult<List<ProductItemDto>>> GetAll()
    {
        var products = await _productService.GetProductsAsync();
        return Ok(products);
    } 

    [HttpPost]
    public async Task<IActionResult> Create([FromForm] ProductCreateDto dto)
    {
        var prod = await _productService.CreateProductAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = prod.Id }, prod);
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

    [HttpGet("{id:long}")]
    public async Task<ActionResult<ProductItemDto>> GetById(long id)
    {
        var product = await _productService.GetByIdAsync(id);
        if (product == null) return NotFound();
        return Ok(product);
    }
}
