namespace Core.Models
{
    public class JwtOptions
    {
        public string Issuer { get; set; } = string.Empty;
        public string Key { get; set; } = string.Empty;
        public int AccessTokenLifetimeInMinutes { get; set; }
        public int RefreshTokenLifetimeInDays { get; set; }
    }
}
