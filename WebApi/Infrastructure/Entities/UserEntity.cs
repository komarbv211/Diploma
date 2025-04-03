using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Entities
{
    public class UserEntity : IdentityUser<long>
    {
        //[Required, StringLength(75)]
        //public string FirstName { get; set; }

        //[Required, StringLength(75)]
        //public string SecondName { get; set; }

        //public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        //[Required, StringLength(20)]
        //public string Phone { get; set; }

        //[StringLength(200)]
        //public string? ImageUrl { get; set; }

        //[StringLength(100)]
        //public string Email { get; set; }

        //[StringLength(255)]
        //public string Password { get; set; }

        //public virtual ICollection<OrderEntity> Orders { get; set; }
        public virtual ICollection<UserRoleEntity> UserRoles { get; set; }
    }
}
