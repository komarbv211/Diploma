using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Infrastructure.Entities
{
    public class UserEntity : IdentityUser<long>
    {
        [StringLength(75)]
        public string? FirstName { get; set; }

        [StringLength(75)]
        public string? LastName { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        public DateTime? LastActivity { get; set; } = DateTime.UtcNow;

        public string? PhoneNumber { get; set; }

        [Column(TypeName = "date")]
        public DateTime? BirthDate { get; set; }

        public bool IsRemove { get; set; }

        [StringLength(200)]
        public string? Image { get; set; }

        public ICollection<RefreshToken> RefreshTokens { get; set; } = new HashSet<RefreshToken>();

        public virtual ICollection<UserLoginEntity>? UserLogins { get; set; }
        public virtual ICollection<OrderEntity>? Orders { get; set; }
        public virtual ICollection<UserRoleEntity>? UserRoles { get; set; }
        public virtual ICollection<ProductRatingEntity>? Ratings { get; set; }
        public ICollection<CartEntity>? Carts { get; set; }
        public virtual ICollection<CommentEntity>? Comments { get; set; }
        public ICollection<FavoriteEntity>? Favorites { get; set; }
    }
}
