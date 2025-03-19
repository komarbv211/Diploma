using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class DbMakeUpContext : DbContext
    {
        public DbMakeUpContext(DbContextOptions<DbMakeUpContext> options):
            base(options) { }

        public DbSet<CategoryEntity> Categories { get; set; }
    }
}
