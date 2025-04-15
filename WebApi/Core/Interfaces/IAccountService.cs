using Core.DTOs.AuthorizationDTOs;
using Core.Models.Authentication;
using Infrastructure.Entities;

namespace Core.Interfaces
{
    public interface IAccountService
    {
        Task<AuthResponse> LoginAsync(AuthRequest model);
        Task<AuthResponse> GoogleLoginAsync(string googleAccessToken);
        Task LogoutAsync(string token);
        Task<AuthResponse> GenerateTokensAsync(UserEntity user);
        Task<AuthResponse> RefreshTokensAsync(string refreshToken);
        Task<AuthResponse> RegisterAsync(RegisterDto model);
    }
}
