using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Core.Models;

namespace WebApiDiploma.ServiceExtensions
{

    public static class JwtServiceExtensions
    {
        public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, JwtOptions jwtOpts)
        {           
            var signinKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOpts.Key));
            services.AddAuthentication(options =>
             {
                 options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                 options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
             }).AddJwtBearer(cfg =>
             {
                 cfg.RequireHttpsMetadata = false;
                 cfg.SaveToken = true;
                 cfg.TokenValidationParameters = new TokenValidationParameters()
                 {
                     IssuerSigningKey = signinKey,
                     ValidateAudience = false,
                     ValidateIssuer = false,
                     ValidateLifetime = true,
                     ValidateIssuerSigningKey = true,
                     ClockSkew = TimeSpan.Zero
                 };
             });

            return services;
        }

        public static IServiceCollection AddJwtOptions(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddSingleton(_ =>
                configuration
                    .GetSection(nameof(JwtOptions))
                    .Get<JwtOptions>()!);

            return services;
        }
    }
}
