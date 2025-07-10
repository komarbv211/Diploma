namespace WebApiDiploma.ServiceExtensions
{
    public static class CorsServiceExtensions
    {
        public static void AddCorsPolicies(this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("front-end-cors-policy", policy =>
                {
                    policy.WithOrigins(
                        "http://localhost:5173",
                        "https://makeup.itstep.click"
                    )
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials(); // Додано щоб оробляти куки чи заголовки авторизації
                });
            });
        }
    }
}
