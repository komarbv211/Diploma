using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Entities
{
    public class RoleEntity : IdentityRole<long>
    {
        public RoleEntity() : base() { }

        public RoleEntity(string roleName) : base(roleName) { }
        //public virtual ICollection<UserRoleEntity>? UserRoles { get; set; }
        public virtual ICollection<UserRoleEntity>? UserRoles { get; set; } = new List<UserRoleEntity>();
    }
}
