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
        [StringLength(75)]
        public string? FirstName { get; set; }

        [StringLength(75)]
        public string? LastName { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;


        [StringLength(200)]
        public string? Image { get; set; }

      
        //public virtual ICollection<OrderEntity> Orders { get; set; }
        public virtual ICollection<UserRoleEntity> UserRoles { get; set; }
    }
}
