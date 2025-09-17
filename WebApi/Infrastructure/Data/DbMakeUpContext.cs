using Infrastructure.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class DbMakeUpContext : 
        IdentityDbContext<UserEntity, RoleEntity, long,
        IdentityUserClaim<long>, UserRoleEntity, UserLoginEntity,
        IdentityRoleClaim<long>, IdentityUserToken<long>>
    {
        public DbMakeUpContext(DbContextOptions<DbMakeUpContext> options) :
            base(options)
        { }

        public DbSet<CategoryEntity> Categories { get; set; }
        public DbSet<ProductEntity> Products { get; set; }
        public DbSet<ProductImageEntity> ProductImages { get; set; }
        public DbSet<PromotionEntity> Promotions { get; set; }
        public DbSet<ProductRatingEntity> ProductRatings { get; set; }
        public DbSet<CartEntity> Carts { get; set; }
        public DbSet<BrandEntity> Brands { get; set; }
        public DbSet<OrderEntity> Orders { get; set; }
        public DbSet<OrderItemEntity> OrderItems { get; set; }
        public DbSet<NovaPostWarehouseEntity> NovaPostWarehouses { get; set; }
        public DbSet<WarehouseUpdateHistoryEntity> WarehouseUpdateHistories { get; set; }
        public DbSet<CommentEntity> Comments { get; set; }

        // ✅ Нове
        public DbSet<FavoriteEntity> Favorites { get; set; }

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

            builder.Entity<UserLoginEntity>(b =>
            {
                b.HasOne(l => l.User)
                    .WithMany(u => u.UserLogins)
                    .HasForeignKey(l => l.UserId)
                    .IsRequired();
            });

            // Конфігурація для рейтингу
            builder.Entity<ProductRatingEntity>(pr =>
            {
                pr.HasKey(r => r.Id);

                pr.HasOne(r => r.Product)
                    .WithMany(p => p.Ratings)
                    .HasForeignKey(r => r.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);

                pr.HasOne(r => r.User)
                    .WithMany(u => u.Ratings)
                    .HasForeignKey(r => r.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                // Забороняємо дублювання рейтингу від одного користувача для одного продукту
                pr.HasIndex(r => new { r.ProductId, r.UserId }).IsUnique();
            });

            // Конфігурація для кошика
            builder.Entity<CartEntity>(cart =>
            {
                cart.HasKey(c => new { c.ProductId, c.UserId });

                cart.HasOne(c => c.Product)
                    .WithMany(p => p.Carts)
                    .HasForeignKey(c => c.ProductId);

                cart.HasOne(c => c.User)
                    .WithMany(u => u.Carts)
                    .HasForeignKey(c => c.UserId);
            });

            // Конфігурація для коментарів
            builder.Entity<CommentEntity>(c =>
            {
                c.HasKey(x => x.Id);

                c.HasOne(x => x.Product)
                    .WithMany(p => p.Comments)
                    .HasForeignKey(x => x.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);

                c.HasOne(x => x.User)
                    .WithMany(u => u.Comments)
                    .HasForeignKey(x => x.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ✅ Конфігурація для Favorites
            builder.Entity<FavoriteEntity>(fav =>
            {
                fav.HasKey(f => new { f.ProductId, f.UserId });

                fav.HasOne(f => f.Product)
                    .WithMany(p => p.Favorites)
                    .HasForeignKey(f => f.ProductId);

                fav.HasOne(f => f.User)
                    .WithMany(u => u.Favorites)
                    .HasForeignKey(f => f.UserId);
            });
        }
    }
}
