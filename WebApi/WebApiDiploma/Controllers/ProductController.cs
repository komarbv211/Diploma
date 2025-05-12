using Core.DTOs.ProductsDTO;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace WebApiDiploma.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductController : ControllerBase
{
    private readonly IProductService _productService;
    private readonly IImageService _imageService;

    public ProductController(IProductService productService, IImageService imageService)
    {
        _productService = productService;
        _imageService = imageService;
    }

    [HttpGet]
    public async Task<ActionResult<List<ProductItemDto>>> GetAll()
    {
        var products = await _productService.GetProductsAsync();
        return Ok(products);
    }

    [HttpGet("{id:long}")]
    public async Task<ActionResult<ProductItemDto>> GetById(long id)
    {
        var product = await _productService.GetByIdAsync(id);
        if (product == null) return NotFound();
        return Ok(product);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ProductCreateDto dto)
    {
        await _productService.CreateProductAsync(dto);
        return Ok();
    }

    [HttpPut]
    public async Task<IActionResult> Update([FromBody] ProductUpdateDto dto)
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
