using Core.DTOs.ProductsDTO;
using Core.Interfaces;
using Core.Models.Search;
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

    // Новий ендпоінт для встановлення акції та знижки
    [HttpPut("set-promotion")]
    public async Task<IActionResult> SetPromotion([FromBody] ProductSetPromotionDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        await _productService.SetProductPromotionAsync(dto);
        return Ok(new { message = "Продукт успішно прив'язано до акції" });
    }


    [HttpGet("search")]
    public async Task<IActionResult> SearchProduct([FromQuery] ProductSearchModel model, [FromQuery] bool isAdmin = false)
    {
        //if (model.Roles != null && model.Roles.Any())
        //{
        //    _logger.LogInformation("Roles from query: {Roles}", string.Join(", ", model.Roles));
        //}
        //else
        //{
        //    _logger.LogInformation("No roles provided in the query.");
        //}
        //bool isAdmin = User.IsInRole("Admin");
        var result = await _productService.SearchProductsAsync(model, isAdmin);


        //var result = await _productService.SearchProductsAsync(model);
        return Ok(result);
    }
}
