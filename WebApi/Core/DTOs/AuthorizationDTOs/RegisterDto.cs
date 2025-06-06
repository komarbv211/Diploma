using System.ComponentModel.DataAnnotations;

namespace Core.DTOs.AuthorizationDTOs
{
    public class RegisterDto
    {
        [Required, MaxLength(255)]
        public string? FirstName { get; set; }

        [Required, MaxLength(255)]
        public string? LastName { get; set; } 

        [Required]
        public string? Email { get; set; } 
         [Required]
        public string? PhoneNumber { get; set; }

        [Required]
        public string? Password { get; set; }

        public string? Image { get; set; }
    }
}
