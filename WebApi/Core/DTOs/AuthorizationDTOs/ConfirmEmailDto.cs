using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.DTOs.AuthorizationDTOs
{
    public class ConfirmEmailDto
    {
        [Required]
        public long UserId { get; set; }

        [Required]
        public string Token { get; set; } = string.Empty;
    }

}
