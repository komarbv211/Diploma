namespace Core.DTOs.FavoriteDTOs;

public class FavoriteItemDTO
{
    public long ProductId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string CategoryId { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string ImageName { get; set; } = string.Empty;
    public decimal? DiscountPercent { get; set; }
    public decimal FinalPrice { get; set; }

}
