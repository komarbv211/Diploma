using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Entities;

public class UserLoginEntity : IdentityUserLogin<long>
{
    public UserEntity User { get; set; }
}
