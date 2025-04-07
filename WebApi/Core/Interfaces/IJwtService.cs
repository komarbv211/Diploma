using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
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
