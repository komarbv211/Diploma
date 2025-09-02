using Microsoft.Extensions.DependencyInjection;
using Core.Interfaces;
using Core.Services;
using Core.Repositories;

namespace Core.Extensions
{
    public static class CoreServiceExtensions
    {
        public static void AddCoreServices(this IServiceCollection services)
        {
            services.AddScoped<IImageService, ImageService>();
            services.AddScoped<IJwtService, JwtService>();
            services.AddScoped<IAccountService, AccountService>();
            services.AddScoped<IGoogleAuthService, GoogleAuthService>();
            services.AddScoped<IProductService, ProductService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<ICategoryRepository, CategoryRepository>();
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<IPromotionRepository, PromotionRepository>();
            services.AddScoped<IPromotionService, PromotionService>();
            services.AddScoped<IProductRatingService, ProductRatingService>();
            services.AddScoped<ICartService, CartService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IOrderService, OrderService>();
            services.AddScoped<ICommentService, CommentService>();
        }
    }
}
