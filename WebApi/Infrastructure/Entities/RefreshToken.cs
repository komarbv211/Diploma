using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace Infrastructure.Entities
{
    [Table("tbl_RefreshTokens")]
    public class RefreshToken : BaseEntity<long>
    {
        public long UserId { get; set; }
        public UserEntity User { get; set; } = null!;

        [Unicode(false)]
        public string Token { get; set; } = string.Empty;
        public DateTime ExpirationDate { get; set; }
    }
}
