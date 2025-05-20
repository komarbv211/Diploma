﻿using System.ComponentModel.DataAnnotations;

namespace Core.DTOs.AuthorizationDTOs
{
    public class ForgotPasswordDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}