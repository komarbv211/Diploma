using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.DTOs.UsersDTOs
{
    public class UserBlockDTO
    {
        public long Id { get; set; }
        public DateTimeOffset? Until { get; set; }
    }
}

