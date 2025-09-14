namespace WebApiDiploma.ServiceExtensions
{
    public static class CorsServiceExtensions
    {
        public static void AddCorsPolicies(this IServiceCollection services, 
            IConfiguration configuration)
        {
            var allowedOrigins = configuration["Cors:AllowedOrigins"];
            services.AddCors(options =>
            {
                options.AddPolicy("front-end-cors-policy", policy =>
                {
                    policy.WithOrigins(
                        allowedOrigins ?? ""
                    )
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials(); // Додано щоб оробляти куки чи заголовки авторизації
                });
            });
        }
    }
}
