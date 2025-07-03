using System.ComponentModel.DataAnnotations;

namespace Core.DTOs.AuthorizationDTOs
{
    public class ResetPasswordDto
    {
        [Required]
        public long Id { get; set; }

        [Required]
        public string Token { get; set; }

        [Required]
        public string Password { get; set; }
    }
}


