namespace WebApiDiploma.Models.Seeder
{
    public class SeederUserModel{
    
        public string Email { get; init; } = string.Empty;
        public string Password { get; init; } = string.Empty;
        public string? FirstName { get; init; }
        public string? LastName { get; init; }
        public string Role { get; init; } = string.Empty;
        public string? PhoneNumber { get; init; }
        public string? PhotoBase64 { get; init; }
        public string? PhotoUrl { get; init; }
    }
}
