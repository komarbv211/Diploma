using Core.Interfaces;
using Core.Models;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Net.Http.Headers;

namespace Core.Services
{
    public class GoogleAuthService : IGoogleAuthService 
    {
        private readonly string _userInfoUrl;

        public GoogleAuthService(IConfiguration configuration)
        {
            _userInfoUrl = configuration["GoogleUserInfoUrl"]!;
        }

        public async Task<GoogleUserInfo> GetUserInfoAsync(string accessToken)
        {
            using var httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var response = await httpClient.GetAsync(_userInfoUrl);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<GoogleUserInfo>(json)!;
        }
    }
}
