using Core.DTOs.AuthorizationDTOs;
using Core.Interfaces;
using Core.Models.Authentication;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using RefreshRequest = Core.Models.Authentication.RefreshRequest;

namespace WebApiDiploma.Controllers.Public
{
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

        //[HttpPost("login")]
        //public async Task<IActionResult> Login([FromBody] AuthRequest model)
        //{
        //    var authResponse = await accountService.LoginAsync(model);
        //    return Ok(authResponse);
        //}
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

        [HttpGet("is-registered-google")]
        public async Task<IActionResult> IsRegisteredWithGoogle([FromQuery] string email)
        {
            var isGoogleUser = await accountService.IsRegisteredWithGoogleAsync(email);
            return Ok(new { isGoogleUser });
        }


        //[HttpPost("refreshTokens")]
        //public async Task<IActionResult> RefreshTokens([FromBody] RefreshRequest refreshRequest)
        //{
        //    string token;

        //    if (refreshRequest is not null && refreshRequest.RefreshToken is not null)
        //    {
        //        token = refreshRequest.RefreshToken;
        //    }
        //    else return Unauthorized();
        //    var authResponse = await accountService.RefreshTokensAsync(token);
        //    return Ok(authResponse);
        //}
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
        public async Task<IActionResult> LogOut([FromBody] LogoutModel? logoutModel)
        {
            if (logoutModel is not null && logoutModel.RefreshToken is not null)
            {
                await accountService.LogoutAsync(logoutModel.RefreshToken);
                _cookieService.DeleteRefreshTokenCookie(Response);
            }
            return Ok();
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
    }
}
