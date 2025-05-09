using Core.Interfaces;
using Core.Mappers;
using Core.Services;
using Infrastructure.Repositories;

namespace WebApiDiploma.Extensions
{
    public static class WebApiServiceExtensions
    {
        public static IServiceCollection AddWebApiServices(this IServiceCollection services)
        {
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());//сканує всі мапери які наслідують Profile

            return services;
        }
    }
}
