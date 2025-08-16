using Core.Interfaces;
using Core.Repositories;
using Core.Services;

namespace WebApiDiploma.ServiceExtensions
{
    public static class WebApiServiceExtensions
    {
        public static IServiceCollection AddWebApiServices(this IServiceCollection services)
        {
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            services.AddHttpClient<NovaPoshtaService>();

            return services;
        }        
    }
}
