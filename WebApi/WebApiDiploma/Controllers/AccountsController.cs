using Core.Interfaces;
using Core.Models.Authentication;
using Microsoft.AspNetCore.Mvc;
using RefreshRequest = Core.Models.Authentication.RefreshRequest;

namespace WebApiDiploma.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        private readonly IAccountService accountService;

        public AccountsController(IAccountService accountsService)
        {
            this.accountService = accountsService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AuthRequest model)
        {
            var authResponse = await accountService.LoginAsync(model);
            return Ok(authResponse);
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

        [HttpDelete("logout")]
        public async Task<IActionResult> Logout([FromBody] string refreshToken)
        {
            await accountService.LogoutAsync(refreshToken);
            return Ok();
        }
    }
}
