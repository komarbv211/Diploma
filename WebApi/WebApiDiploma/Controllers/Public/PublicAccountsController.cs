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

        public PublicAccountsController(IAccountService accountsService)
        {
            accountService = accountsService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AuthRequest model)
        {
            var authResponse = await accountService.LoginAsync(model);
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

        [HttpPost("refreshTokens")]
        public async Task<IActionResult> RefreshTokens([FromBody] RefreshRequest refreshRequest)
        {
            string token;
           
            if (refreshRequest is not null && refreshRequest.RefreshToken is not null)
            {
                token = refreshRequest.RefreshToken;
            }
            else return Unauthorized();
            var authResponse = await accountService.RefreshTokensAsync(token);
            return Ok(authResponse);
        }

        [HttpPost("logout")]
        public async Task<IActionResult> LogOut([FromBody] LogoutModel? logoutModel)
        {
            
            if (logoutModel is not null && logoutModel.RefreshToken is not null)
            {
                await accountService.LogoutAsync(logoutModel.RefreshToken);
            }
            return Ok();
        }
    }
}
