using System.Security.Claims;
using Infrastructure.Entities;

namespace Core.Interfaces
{
    public interface IJwtService
    {
        Task<IEnumerable<Claim>> GetClaimsAsync(UserEntity user);
        string CreateToken(IEnumerable<Claim> claims);
        string GetRefreshToken();
        int GetRefreshTokenLiveTime();
    }
}
