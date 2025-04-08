using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models.User
{
    public class ResetPasswordModel
    {
        public string Password { get; init; } = string.Empty;
        public string Token { get; init; } = string.Empty;
        public int UserId { get; init; }
    }
}
