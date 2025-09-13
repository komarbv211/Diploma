using Core.DTOs.AnalyticsDTOs;

namespace Core.Interfaces;

public interface IAnalyticsService
{
    Task<IEnumerable<RevenuePointDto>> GetRevenueByPeriodAsync(DateTime startUtc, DateTime endUtc);
    Task<IEnumerable<TopProductDto>> GetTopProductsAsync(int top = 10, DateTime? startUtc = null, DateTime? endUtc = null);
    Task<OrdersSummaryDto> GetOrdersSummaryAsync(DateTime startUtc, DateTime endUtc);
    Task<IEnumerable<CategorySalesDto>> GetSalesByCategoryAsync(DateTime startUtc, DateTime endUtc);
    Task<NewCustomersDto> GetNewCustomersCountAsync(DateTime startUtc, DateTime endUtc);
    Task<RepeatPurchaseDto> GetRepeatPurchaseStatsAsync(DateTime startUtc, DateTime endUtc);
    Task<UserAnalyticsDto> GetUserAnalyticsAsync(DateTime startUtc, DateTime endUtc);
}