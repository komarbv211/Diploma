using Core.Models;

namespace Core.Interfaces
{
    public interface IGoogleAuthService
    {
        Task<GoogleUserInfo> GetUserInfoAsync(string accessToken);
    }

}
