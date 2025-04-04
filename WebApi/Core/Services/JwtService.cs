using Core.Exceptions;
using Core.Interfaces;
using Core.Resources;
using Infrastructure.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using System.Net;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Core.Models;

namespace Core.Services
{
    public class JwtService(IConfiguration configuration, UserManager<UserEntity> userManager) : IJwtService
    {
        private JwtOptions _jwtOpts = configuration.GetSection(nameof(JwtOptions)).Get<JwtOptions>()
                ?? throw new HttpException(Errors.JwtSettingsReadError, HttpStatusCode.InternalServerError);

        public string GetRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        public string CreateToken(IEnumerable<Claim> claims)
        {
            var time = DateTime.UtcNow.AddMinutes(_jwtOpts.AccessTokenLifetimeInMinutes);
            var credentials = getCredentials(_jwtOpts);
            var token = new JwtSecurityToken(
                issuer: _jwtOpts.Issuer,
                claims: claims,
                expires: time,
                signingCredentials: credentials);
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<IEnumerable<Claim>> GetClaimsAsync(UserEntity user)
        {
            var claims = new List<Claim>
            {
                new (ClaimTypes.NameIdentifier,user.Id.ToString()),
                new ("firstName", user.FirstName ?? string.Empty),
                new ("secondName", user.SecondName ?? string.Empty),
                new ("email", user.Email!),
                new ("phoneNumber", user.PhoneNumber ?? string.Empty),
                new ("image", user.ImageUrl ?? string.Empty),
            };
            var roles = await userManager.GetRolesAsync(user);
            claims.AddRange(roles.Select(role => new Claim("roles", role)));
            return claims;
        }

        public int GetRefreshTokenLiveTime() => _jwtOpts.RefreshTokenLifetimeInDays;

        private SigningCredentials getCredentials(JwtOptions options)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(options.Key));
            return new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
        }
    }
}
