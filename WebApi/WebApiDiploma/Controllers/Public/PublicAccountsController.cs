using Core.DTOs.AuthorizationDTOs;
using Core.Exceptions;
using Core.Interfaces;
using Core.Models.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace WebApiDiploma.Controllers.Public;

[Route("api/accounts")]
[ApiController]
public class PublicAccountsController : ControllerBase
{
    private readonly IAccountService accountService;
    private readonly ICookieService _cookieService;

    public PublicAccountsController(IAccountService accountsService, ICookieService cookieService)
    {
        accountService = accountsService;
        _cookieService = cookieService;
    }
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] AuthRequest model)
    {
        var authResponse = await accountService.LoginAsync(model);         

        var refreshToken = authResponse.RefreshToken;

        // Зберігаємо refresh токен у cookie
        _cookieService.AppendRefreshTokenCookie(Response, refreshToken);

        return Ok(authResponse);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto model)
    {
        var result = await accountService.RegisterAsync(model);
        return Ok(result); 
    }
    
    [HttpPost("login/google")]
    public async Task<IActionResult> GoogleLogin([FromForm] GoogleLoginViewModel model)
    {
        try
        {
            var response = await accountService.GoogleLoginAsync(model);
            return Ok(response);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    [HttpPost("register/google")]
    public async Task<IActionResult> GoogleRegister([FromForm] GoogleFirstRegisterModel model)
    {
        try
        {
            var response = await accountService.FirstRegisterGoogleAsync(model);
            return Ok(response);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }
    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        var refreshToken = Request.Cookies["refreshToken"];

        if (string.IsNullOrEmpty(refreshToken))
            return Unauthorized();

        var result = await accountService.RefreshTokensAsync(refreshToken);

        // Оновити refresh token у cookie
        _cookieService.AppendRefreshTokenCookie(Response, result.RefreshToken);

        return Ok(new
        {
            accessToken = result.AccessToken
        });
    }

    [HttpPost("logout")]
    public async Task<IActionResult> LogOut()
    {
        var refreshToken = Request.Cookies["refreshToken"];

        if (!string.IsNullOrEmpty(refreshToken))
        {
            await accountService.LogoutAsync(refreshToken); // видалення з БД
            _cookieService.DeleteRefreshTokenCookie(Response); // видалення з cookie
        }

        return Ok(new { message = "Logged out" });
    }


    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto model)
    {
        await accountService.ForgotPasswordAsync(model);
        return Ok();
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto model)
    {
        await accountService.ResetPasswordAsync(model);
        return Ok();
    }

    [HttpPost("confirm-email")]
    public async Task<IActionResult> ConfirmEmail([FromBody] ConfirmEmailDto dto)
    {
        await accountService.ConfirmEmailAsync(dto);
        return Ok(new { Message = "Email підтверджено успішно" });
    }
}
