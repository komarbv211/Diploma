using Core.DTOs.AuthorizationDTOs;
using Core.Models.Authentication;

namespace Core.Interfaces
{
    public interface IAccountService
    {

        Task<AuthResponse> LoginAsync(AuthRequest model);
        Task LogoutAsync(string token);
        Task<AuthResponse> RefreshTokensAsync(string refreshToken);
    }
}
