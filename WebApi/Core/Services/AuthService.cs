using Core.Interfaces;
using Infrastructure.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace Core.Services;

public class AuthService(IHttpContextAccessor httpContextAccessor) : IAuthService
{
    public Task<long> GetUserId()
    {
        var userIdClaim = httpContextAccessor.HttpContext?.User?.FindFirst("id")?.Value;

        if (string.IsNullOrEmpty(userIdClaim))
            throw new UnauthorizedAccessException("User is not authenticated");

        if (!long.TryParse(userIdClaim, out var userId))
            throw new UnauthorizedAccessException("Invalid user ID claim");

        return Task.FromResult(userId);
    }
}
