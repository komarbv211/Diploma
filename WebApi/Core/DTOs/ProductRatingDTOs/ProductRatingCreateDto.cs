namespace Core.DTOs.ProductRatingDTOs
{
    public class ProductRatingCreateDto
    {
        public long ProductId { get; set; }
        public long UserId { get; set; }
        public int Rating { get; set; }
    }
}
