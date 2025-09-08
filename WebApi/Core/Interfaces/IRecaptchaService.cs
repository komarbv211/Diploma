namespace Core.Interfaces;

public interface IRecaptchaService
{
    Task<bool> VerifyAsync(string token);
}
