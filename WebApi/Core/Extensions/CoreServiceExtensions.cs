using Microsoft.Extensions.DependencyInjection;
using Core.Interfaces;
using Core.Services;

namespace Core.Extensions
{
    public static class CoreServiceExtensions
    {
        public static void AddCoreServices(this IServiceCollection services)
        {
            services.AddScoped<IImageService, ImageService>();           
        }
    }
}
