using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models.User
{
    public class EmailConfirmationModel
    {
        public int Id { get; init; }
        public string Token { get; init; } = string.Empty;
    }
}
