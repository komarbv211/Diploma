using Core.Exceptions;
using Core.Interfaces;
using Core.Models.Authentication;
using Core.Resources;

using Microsoft.AspNetCore.Identity;
using System.Net;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Core.Specifications;
using AutoMapper;

namespace Core.Services
{
    internal class AccountService(
            UserManager<UserEntity> userManager,
            IJwtService jwtService,
            IRepository<RefreshToken> tokenRepository,
            IRepository<UserEntity> userRepository,
            IImageService imageService,
            IGoogleAuthService googleAuthService,
            IMapper mapper
      ) : IAccountService
    {

        // Реалізація методу LoginAsync
        public async Task<AuthResponse> LoginAsync(AuthRequest model)
        {
            // Шукаємо користувача за email
            var user = await userManager.FindByEmailAsync(model.Email);

            // Якщо користувач не знайдений
            if (user == null)
            {
                // Перевіряємо, чи це адміністратор
                if (model.Email == "admin" && model.Password == "admin")  
                {
                    // Створюємо токен для адміністратора
                    var claims = new List<Claim>
            {
                new ("roles", "Administrator")
            };

                    var accessToken = jwtService.CreateToken(claims);
                    var refreshToken = jwtService.GetRefreshToken();

                    return new AuthResponse
                    {
                        AccessToken = accessToken,
                        RefreshToken = refreshToken
                    };
                }
                else
                {
                    throw new HttpException(Errors.InvalidCredentials, HttpStatusCode.Unauthorized);
                }
            }

            // Якщо користувач знайдений, перевіряємо пароль
            if (!await userManager.CheckPasswordAsync(user, model.Password))
            {
                throw new HttpException(Errors.InvalidCredentials, HttpStatusCode.Unauthorized);
            }

            // Створюємо токен для користувача
            var userClaims = await jwtService.GetClaimsAsync(user);
            var userAccessToken = jwtService.CreateToken(userClaims);
            var userRefreshToken = jwtService.GetRefreshToken();

            // Збереження refresh token в БД
            var refreshTokenEntity = new RefreshToken
            {
                UserId = user.Id,
                Token = userRefreshToken,
                ExpirationDate = DateTime.UtcNow.AddDays(jwtService.GetRefreshTokenLiveTime())
            };

            await tokenRepository.AddAsync(refreshTokenEntity);
            await tokenRepository.SaveAsync();

            return new AuthResponse
            {
                AccessToken = userAccessToken,
                RefreshToken = userRefreshToken
            };
        }
        public async Task<AuthResponse> GoogleLoginAsync(string googleAccessToken)
        {
            var userInfo = await googleAuthService.GetUserInfoAsync(googleAccessToken);
            UserEntity user = await userManager.FindByEmailAsync(userInfo.Email) ?? mapper.Map<UserEntity>(userInfo);

            if (user.Id == 0)
            {
                if (!string.IsNullOrEmpty(userInfo.Picture))
                {
                    user.Image = await imageService.SaveImageFromUrlAsync(userInfo.Picture);
                }
                await CreateUserAsync(user);
            }
            return await GetAuthTokens(user);
        }


        // Реалізація методу LogoutAsync
        public async Task LogoutAsync(string refreshToken)
        {
            var token = await tokenRepository.GetItemBySpec(new RefreshTokenSpecs.GetByValue(refreshToken));
            if (token is not null)
            {
                Console.WriteLine($"Токен перед видаленням:  Id: {token.Id}");

                await tokenRepository.DeleteAsync(token.Id);
                await tokenRepository.SaveAsync();
            }
        }


        // Реалізація методу RefreshTokensAsync
        public async Task<AuthResponse> RefreshTokensAsync(string refreshToken)
        {
            var token = await tokenRepository.GetAllQueryable()
                .FirstOrDefaultAsync(t => t.Token == refreshToken);

            if (token == null || token.ExpirationDate < DateTime.UtcNow)
            {
                throw new HttpException(Errors.InvalidRefreshToken, HttpStatusCode.Unauthorized);
            }

            var user = await userRepository.GetAllQueryable()
                .FirstOrDefaultAsync(u => u.Id == token.UserId);

            if (user == null)
            {
                throw new HttpException(Errors.UserNotFound, HttpStatusCode.NotFound);
            }

            var claims = await jwtService.GetClaimsAsync(user);
            var newAccessToken = jwtService.CreateToken(claims);
            var newRefreshToken = jwtService.GetRefreshToken();

            token.Token = newRefreshToken;
            token.ExpirationDate = DateTime.UtcNow.AddDays(jwtService.GetRefreshTokenLiveTime());

            await tokenRepository.SaveAsync();  

            return new AuthResponse
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken
            };

        }
        private async Task<string> CreateRefreshToken(long userId)
        {
            var refeshToken = jwtService.GetRefreshToken();
            var refreshTokenEntity = new RefreshToken
            {
                Token = refeshToken,
                UserId = userId,
                ExpirationDate = DateTime.UtcNow.AddDays(jwtService.GetRefreshTokenLiveTime())
            };
            await tokenRepository.AddAsync(refreshTokenEntity);
            await tokenRepository.SaveAsync();
            return refeshToken;
        }
        private async Task<AuthResponse> GetAuthTokens(UserEntity user)
        {
            return new()
            {
                AccessToken = jwtService.CreateToken(await jwtService.GetClaimsAsync(user)),
                RefreshToken = await CreateRefreshToken(user.Id)
            };
        }
       
    }
}
