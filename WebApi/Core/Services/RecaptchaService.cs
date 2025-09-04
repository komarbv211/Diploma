using Core.Interfaces;
using Core.Models.Authentication;
using Microsoft.Extensions.Configuration;
using System.Text.Json;

namespace Core.Services;

public class RecaptchaService : IRecaptchaService
{
    private readonly IConfiguration _config;
    private readonly HttpClient _httpClient;

    public RecaptchaService(IConfiguration config, HttpClient httpClient)
    {
        _config = config;
        _httpClient = httpClient;
    }

    public async Task<bool> VerifyAsync(string token)
    {
        var secret = _config["GoogleReCaptcha:SecretKey"];
        var response = await _httpClient
            .PostAsync($"https://www.google.com/recaptcha/api/siteverify?secret={secret}&response={token}", null);

        var json = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<RecaptchaResponse>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        return result != null && result.Success;
    }
}