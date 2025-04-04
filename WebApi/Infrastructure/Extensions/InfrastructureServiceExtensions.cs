using Infrastructure.Data;
using Infrastructure.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Graph.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Exceptions
{
    public static class InfrastructureServiceExtensions
    {
        public static IServiceCollection AddIdentityWithRoles(this IServiceCollection services)
        {
            services.AddIdentity<UserEntity, IdentityRole<int>>(options =>
            {
                options.Password.RequireDigit = true;
                options.Password.RequiredLength = 6;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = true;
                options.Password.RequireLowercase = true;
            })
            .AddEntityFrameworkStores<DbMakeUpContext>()
            .AddDefaultTokenProviders();

            return services;
        }
       
    }
}
