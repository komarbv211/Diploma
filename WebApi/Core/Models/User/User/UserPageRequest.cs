using Core.Models.Page;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models.User.User
{
    public class UserPageRequest : PageRequest
    {
        public bool IsAdmin { get; set; }
        public bool IsLocked { get; set; }
        public string? EmailSearch { get; init; }
        public string? PhoneNumberSearch { get; init; }
        public string? FirstNameSearch { get; init; }
        public string? LastNameSearch { get; init; }
        //public string? WebSiteSearch { get; init; }
        //public string? SettlementSearch { get; init; }
    }
}
