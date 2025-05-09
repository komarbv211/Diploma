using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Core.Models.Authentication
{
    public class GoogleFirstRegisterModel
    {
        public string GoogleAccessToken {  get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public IFormFile? Image { get; set; }
        public string? PhoneNumber { get; set; }
    } 
}
