using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models.User
{
    public class AddBackupRequestModel
    {
        public IFormFile BackupFile { get; set; }
    }
}
