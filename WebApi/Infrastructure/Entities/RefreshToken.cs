using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Entities
{
    [Table("tbl_RefreshTokens")]
    public class RefreshToken : BaseEntity<long>
    {
        public int UserId { get; set; }
        public UserEntity User { get; set; } = null!;

        [Unicode(false)]
        public string Token { get; set; } = string.Empty;
        public DateTime ExpirationDate { get; set; }
    }
}
