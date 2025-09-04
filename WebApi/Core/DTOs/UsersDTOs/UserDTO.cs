namespace Core.DTOs.UsersDTOs
{
    public class UserDTO
    {
        public long Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime? LastActivity { get; set; } = DateTime.UtcNow;
        public string? Image { get; set; }
        public string Email { get; set; } = string.Empty;
        public string BirthDate { get; set; } = string.Empty;
        public bool EmailConfirmed { get; set; }
        public bool PhoneNumberConfirmed { get; set; }
        public bool TwoFactorEnabled { get; set; }
        public string? PhoneNumber { get; set; }
        public DateTimeOffset? LockoutEnd { get; set; }
        public bool IsBlocked => LockoutEnd.HasValue && LockoutEnd.Value > DateTimeOffset.UtcNow;
    }
}
