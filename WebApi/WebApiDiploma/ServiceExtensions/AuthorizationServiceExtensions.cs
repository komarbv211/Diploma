namespace WebApiDiploma.ServiceExtensions
{
    public static class AuthorizationServiceExtensions
    {
        public static IServiceCollection AddAuthorizationPolicies(this IServiceCollection services)
        {
            services.AddAuthorization(options =>
            {
                options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
                options.AddPolicy("ClientOnly", policy => policy.RequireRole("User"));
            });

            return services;
        }
    }
}
