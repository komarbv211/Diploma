using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models.User
{
    public class BackupFileInfo
    {
        public string Name { get; set; } = string.Empty;
        public DateTime DateCreationDate { get; set; }
        public long Size { get; set; }
    }
}
