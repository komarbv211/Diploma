using Core.DTOs.AnalyticsDTOs;
using Core.Interfaces;
using Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApiDiploma.Controllers.Admin;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/admin/analytic")]
public class AdminAnalyticsController : ControllerBase
{
    private readonly IAnalyticsService _analytics;

    public AdminAnalyticsController(IAnalyticsService analytics)
    {
        _analytics = analytics;
    }

    [HttpGet("revenue")]
    public async Task<IActionResult> GetRevenue([FromQuery] DateTime startUtc, [FromQuery] DateTime endUtc)
    {
        var data = await _analytics.GetRevenueByPeriodAsync(startUtc, endUtc);
        return Ok(data);
    }

    [HttpGet("top-products")]
    public async Task<IActionResult> GetTopProducts([FromQuery] int top = 10, [FromQuery] DateTime? startUtc = null, [FromQuery] DateTime? endUtc = null)
    {
        var data = await _analytics.GetTopProductsAsync(top, startUtc, endUtc);
        return Ok(data);
    }

    [HttpGet("orders-summary")]
    public async Task<IActionResult> GetOrdersSummary([FromQuery] DateTime startUtc, [FromQuery] DateTime endUtc)
    {
        var data = await _analytics.GetOrdersSummaryAsync(startUtc, endUtc);
        return Ok(data);
    }

    [HttpGet("sales-by-category")]
    public async Task<IActionResult> GetSalesByCategory([FromQuery] DateTime startUtc, [FromQuery] DateTime endUtc)
    {
        var data = await _analytics.GetSalesByCategoryAsync(startUtc, endUtc);
        return Ok(data);
    }

    [HttpGet("new-customers")]
    public async Task<IActionResult> GetNewCustomers([FromQuery] DateTime startUtc, [FromQuery] DateTime endUtc)
    {
        var data = await _analytics.GetNewCustomersCountAsync(startUtc, endUtc);
        return Ok(data);
    }

    [HttpGet("repeat-purchases")]
    public async Task<IActionResult> GetRepeatPurchase([FromQuery] DateTime startUtc, [FromQuery] DateTime endUtc)
    {
        var data = await _analytics.GetRepeatPurchaseStatsAsync(startUtc, endUtc);
        return Ok(data);
    }
    [HttpGet("users")]
    public async Task<ActionResult<UserAnalyticsDto>> GetUserAnalytics(
           DateTime startUtc, DateTime endUtc)
    {
        var result = await _analytics.GetUserAnalyticsAsync(startUtc, endUtc);
        return Ok(result);
    }
}
