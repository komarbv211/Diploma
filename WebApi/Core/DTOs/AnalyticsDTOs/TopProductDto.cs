namespace Core.DTOs.AnalyticsDTOs;

public class TopProductDto
{
    public long ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public long QuantitySold { get; set; }
    public decimal Revenue { get; set; }
}
