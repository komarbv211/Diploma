﻿using Core.DTOs.AuthorizationDTOs;
using Core.Interfaces;
using Core.Models.Authentication;
using Microsoft.AspNetCore.Identity.Data;
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

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            var result = await accountService.RegisterAsync(model);
            return Ok(result); 
        }

        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromBody] string googleAccessToken)
        {
            if (string.IsNullOrWhiteSpace(googleAccessToken))
            {
                return BadRequest("Google access token is required.");
            }

            var authResponse = await accountService.GoogleLoginAsync(googleAccessToken);
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
