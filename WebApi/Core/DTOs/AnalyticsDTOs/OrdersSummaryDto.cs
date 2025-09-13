namespace Core.DTOs.AnalyticsDTOs;

public class OrdersSummaryDto
{
    public int OrdersCount { get; set; }
    public decimal TotalRevenue { get; set; }
    public decimal AverageOrderValue { get; set; }
}
