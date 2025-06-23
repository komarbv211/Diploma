using Microsoft.AspNetCore.Http;

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
        public DateTime? BirthDate {get; set;}
        public bool EmailConfirmed { get; set; }
        public bool PhoneNumberConfirmed { get; set; }
        public bool TwoFactorEnabled { get; set; }
        public string? PhoneNumber { get; set; }

        // якщо не знадобиться видалимо.
        //public IEnumerable<int> Adverts { get; set; } = [];
        //public IEnumerable<int> FavoriteAdverts { get; set; } = [];
    }
}
