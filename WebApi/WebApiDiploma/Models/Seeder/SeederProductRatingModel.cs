using Infrastructure.Entities;

namespace WebApiDiploma.Models.Seeder
{
    public class SeederProductRatingModel
    {
        public long Id { get; set; }
        public long ProductId { get; set; }
        public long UserId { get; set; }
        public int Rating { get; set; }

        public ProductEntity? Product { get; set; }
        public UserEntity? User { get; set; }
    }
}
