using Core.DTOs.ProductsDTO;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace WebApiDiploma.Controllers.Public;

[ApiController]
[Route("api/product")]
public class PublicProductController : ControllerBase
{
    private readonly IProductService _productService;  

    public PublicProductController(IProductService productService)
    {
        _productService = productService;   
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
}
