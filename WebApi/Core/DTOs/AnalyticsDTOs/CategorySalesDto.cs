namespace Core.DTOs.AnalyticsDTOs;

public class CategorySalesDto
{
    public long CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public long QuantitySold { get; set; }
    public decimal Revenue { get; set; }
}
