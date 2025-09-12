namespace Core.DTOs.AnalyticsDTOs;

public class UserAnalyticsDto
{
    public int TotalUsers { get; set; }
    public int NewUsers { get; set; }
    public int ActiveUsers { get; set; }
    public int InactiveUsers { get; set; }
    public decimal LifetimeValue { get; set; }
}
