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
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                    .AddJwtBearer(o =>
                    {
                        o.TokenValidationParameters = new TokenValidationParameters
                        {
                            ValidateIssuer = true,
                            ValidateAudience = false,
                            ValidateLifetime = true,
                            ValidateIssuerSigningKey = true,
                            ValidIssuer = jwtOpts.Issuer,
                            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOpts.Key)),
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
