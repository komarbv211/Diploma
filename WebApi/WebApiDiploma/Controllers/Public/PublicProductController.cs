using Core.DTOs.ProductsDTO;
using Core.Interfaces;
using Core.Models.Search;
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

     [HttpGet("search")]
    public async Task<IActionResult> SearchProduct([FromQuery] ProductSearchModel model)
    {
        var request = Request;
        
        var result = await _productService.SearchProductsAsync(model,  false);

        return Ok(result);
    }
    [HttpPost("by-categories")]
    public async Task<ActionResult<List<ProductItemDto>>> GetByCategories([FromBody] List<long> categoryIds)
    {
        if (categoryIds == null || !categoryIds.Any())
            return BadRequest("Список категорій порожній");

        var products = await _productService.GetProductsByCategoriesAsync(categoryIds);
        return Ok(products);
    }

}
