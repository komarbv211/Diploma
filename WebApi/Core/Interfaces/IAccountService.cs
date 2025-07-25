﻿using Core.DTOs.AuthorizationDTOs;
using Core.DTOs.PaginationDTOs;
using Core.Models.Authentication;
using Core.Models.Search;
using Infrastructure.Entities;

namespace Core.Interfaces
{
    public interface IAccountService
    {
        Task<AuthResponse> LoginAsync(AuthRequest model);
        Task<AuthResponse> GoogleLoginAsync(GoogleLoginViewModel model);
        Task<AuthResponse> FirstRegisterGoogleAsync(GoogleFirstRegisterModel model);
        Task LogoutAsync(string token);
        Task<AuthResponse> GenerateTokensAsync(UserEntity user);
        Task<AuthResponse> RefreshTokensAsync(string refreshToken);
        Task<AuthResponse> RegisterAsync(RegisterDto model);
        Task ForgotPasswordAsync(ForgotPasswordDto model);
        Task ResetPasswordAsync(ResetPasswordDto model);
        //Task<SearchResult<UserEntity>> SearchUsersAsync(UserSearchModel model);
        //Task<bool> IsRegisteredWithGoogleAsync(string email);
    }
}