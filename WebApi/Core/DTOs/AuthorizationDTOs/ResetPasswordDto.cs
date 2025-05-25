using System.ComponentModel.DataAnnotations;

namespace Core.DTOs.AuthorizationDTOs
{
    public class ResetPasswordDto
    {
        [Required]
        [EmailAddress] 
        public string Email { get; set; }

        [Required]
        public string Token { get; set; }

        [Required]
        public string Password { get; set; }
    }
}


