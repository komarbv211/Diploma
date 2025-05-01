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
using Core.DTOs.AuthorizationDTOs;
using AutoMapper;
using System.Data;

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

            return await GenerateTokensAsync(user);
        }

        public async Task<AuthResponse> GenerateTokensAsync(UserEntity user)
        {
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
        private async Task CreateUserAsync(UserEntity user, string? password = null, bool isAdmin = false)
        {
            user.EmailConfirmed = user.EmailConfirmed || isAdmin;
            var result = password is not null
                ? await userManager.CreateAsync(user, password)
                : await userManager.CreateAsync(user);
            if (!result.Succeeded)
            {
                throw new HttpException(Errors.UserCreateError, HttpStatusCode.InternalServerError);
            }
            //await userManager.AddToRoleAsync(user, isAdmin ? Roles.Admin : Roles.User);
            //if (!isAdmin && !await userManager.IsEmailConfirmedAsync(user))
            //{
            //    await SendEmailConfirmationMessageAsync(user);
            //}
        }
        //public async Task<AuthResponse> GoogleLoginAsync(GoogleLoginViewModel model)
        //{
        //    var userInfo = await googleAuthService.GetUserInfoAsync(model.GoogleAccessToken);
        //    UserEntity user = await userManager.FindByEmailAsync(userInfo.Email) ?? mapper.Map<UserEntity>(userInfo);

        //    if (user.Id == 0)
        //    {
        //        if (!string.IsNullOrEmpty(userInfo.Picture))
        //        {
        //            user.Image = await imageService.SaveImageFromUrlAsync(userInfo.Picture);
        //        }
        //        await CreateUserAsync(user);
        //    }
        //    return await GetAuthTokens(user);
        //}
        public async Task<AuthResponse> GoogleLoginAsync(GoogleLoginViewModel model)
        {
            var userInfo = await googleAuthService.GetUserInfoAsync(model.GoogleAccessToken);

            // Знаходимо користувача за email
            UserEntity user = await userManager.FindByEmailAsync(userInfo.Email) ?? mapper.Map<UserEntity>(userInfo);

            // Якщо користувач не знайдений (новий), створюємо його
            if (user.Id == 0)
            {
                // Заповнюємо дані користувача з моделі
                user.FirstName = model.FirstName ?? userInfo.Given_Name;
                user.LastName = model.LastName ?? userInfo.Family_Name;
                user.PhoneNumber = model.PhoneNumber;
                user.Email = userInfo.Email;

                // Якщо є зображення, зберігаємо його                
                if (model.Image != null)
                {
                    user.Image = await imageService.SaveImageAsync(model.Image);
                }
                else if (!string.IsNullOrEmpty(userInfo.Picture))
                {
                    user.Image = await imageService.SaveImageFromUrlAsync(userInfo.Picture);
                }

                // Створюємо користувача
                await CreateUserAsync(user);
            }

            // Повертаємо токени автентифікації
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

        public async Task<AuthResponse> RegisterAsync(RegisterDto model)
        {
            var user = mapper.Map<UserEntity>(model);

            var res = await userManager.CreateAsync(user, model.Password);

            if (!res.Succeeded)
            {
                var errors = string.Join(", ", res.Errors.Select(e => e.Description));
                throw new HttpException($"User creation failed: {errors}", HttpStatusCode.BadRequest);
            }

            await userManager.AddToRoleAsync(user, "User");
            user = await userManager.FindByEmailAsync(user.Email);

            return await GenerateTokensAsync(user);
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
