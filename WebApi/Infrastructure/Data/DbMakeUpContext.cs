using Infrastructure.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace Infrastructure.Data
{
    public class DbMakeUpContext : IdentityDbContext<UserEntity, RoleEntity, long>
    {


        public DbMakeUpContext(DbContextOptions<DbMakeUpContext> options):
            base(options) { }

        public DbSet<CategoryEntity> Categories { get; set; }
        public DbSet<ProductEntity> Products { get; set; }
        public DbSet<ProductImageEntity> ProductImages { get; set; }
        public DbSet<DiscountTypeEntity> DiscountTypes { get; set; }
        public DbSet<PromotionEntity> Promotions { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<UserRoleEntity>(ur =>
            {
                ur.HasOne(ur => ur.Role)
                    .WithMany(r => r.UserRoles)
                    .HasForeignKey(r => r.RoleId)
                    .IsRequired();

                ur.HasOne(ur => ur.User)
                    .WithMany(r => r.UserRoles)
                    .HasForeignKey(u => u.UserId)
                    .IsRequired();
            });

            // Багато-до-багатьох: Promotions <-> Products
            //builder.Entity<PromotionEntity>()
            //    .HasMany(p => p.Products)
            //    .WithMany(p => p.Promotions)
            //    .UsingEntity(j => j.ToTable("PromotionProducts"));

        }

    }
}
