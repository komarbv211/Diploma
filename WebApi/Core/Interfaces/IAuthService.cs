namespace Core.Interfaces;

public interface IAuthService
{
    Task<long> GetUserId();
}