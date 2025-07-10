using Core.Interfaces;

namespace WebApiDiploma.ServiceExtensions;

public class CookieService : ICookieService
{
    private readonly IConfiguration _config;
    private readonly IWebHostEnvironment _env;

    public CookieService(IConfiguration config, IWebHostEnvironment env)
    {
        _config = config;
        _env = env;
    }

    public CookieOptions GetRefreshTokenCookieOptions()
    {
        var refreshDays = int.TryParse(_config["JwtOptions:RefreshTokenLifeTimeInDays"], out var days) ? days : 7;
        var options = new CookieOptions
        {
            HttpOnly = true,
            Path = "/",
            Expires = DateTime.UtcNow.AddDays(refreshDays)
        };

        if (_env.IsDevelopment())
        {
            options.SameSite = SameSiteMode.Lax; // або None, якщо треба
            options.Secure = false;
            // options.Domain = null; // для localhost не треба
        }
        else
        {
            options.SameSite = SameSiteMode.None;
            options.Secure = true;
            options.Domain = _config["CookieSettings:Domain"];
        }

        return options;
    }

    public void AppendRefreshTokenCookie(HttpResponse response, string refreshToken)
    {
        response.Cookies.Append("refreshToken", refreshToken, GetRefreshTokenCookieOptions());
    }

    public void DeleteRefreshTokenCookie(HttpResponse response)
    {
        response.Cookies.Delete("refreshToken", GetRefreshTokenCookieOptions());
    }
}
