using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Entities
{
    public class RoleEntity : IdentityRole<long>
    {
        public virtual ICollection<UserRoleEntity> ? UserRoles { get; set; }
    }
}
