using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Entities
{
    public class RoleEntity : IdentityRole<long>
    {
        public virtual ICollection<UserRoleEntity> ? UserRoles { get; set; }
    }
}
