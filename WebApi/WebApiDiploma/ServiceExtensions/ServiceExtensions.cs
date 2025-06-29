namespace WebApiDiploma.ServiceExtensions
{
    public static class ServiceExtensions
    {
        public static void AddCorsPolicies(this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy(name: "front-end-cors-policy",
                    policy =>
                    {                      
                        policy.WithOrigins([
                            "http://localhost:5173",
                            "https://makeup.itstep.click"
                            ]);                                          
                        //policy.AllowAnyOrigin();
                        policy.AllowAnyMethod();
                        policy.AllowAnyHeader();
                    });
            });
        }
    }
}
