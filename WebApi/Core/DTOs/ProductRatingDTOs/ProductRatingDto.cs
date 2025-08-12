namespace Core.DTOs.ProductRatingDTOs
{
    public class ProductRatingDto
    {
        public long Id { get; set; }
        public long ProductId { get; set; }
        public long UserId { get; set; }
        public int Rating { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
