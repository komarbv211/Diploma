using Core.Exceptions;
using Core.Extensions;
using Core.Models;
using FluentValidation;
using FluentValidation.AspNetCore;
using Infrastructure.Data;
using Infrastructure.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using WebApiDiploma.ServiceExtensions;

var builder = WebApplication.CreateBuilder(args);

// 1. Підключення бази даних
builder.Services.AddDbContext<DbMakeUpContext>(opt =>
{
    opt.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// 2. Identity
builder.Services.AddIdentity<UserEntity, RoleEntity>(options =>
{
    options.Stores.MaxLengthForKeys = 128;
    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 5;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
})
.AddEntityFrameworkStores<DbMakeUpContext>()
.AddDefaultTokenProviders();

// 3. Власні сервіси

builder.Services.AddWebApiServices();
builder.Services.AddCoreServices();

// 4. Controllers
builder.Services.AddControllers();

// 5. JWT автентифікація та авторизація
builder.Services.AddJwtOptions(builder.Configuration);
var jwtOpts = builder.Configuration.GetSection(nameof(JwtOptions)).Get<JwtOptions>()!;
builder.Services.AddJwtAuthentication(jwtOpts);
builder.Services.AddAuthorizationPolicies();

// 6. Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(); // основний
builder.Services.AddSwaggerJWT(); // +JWT

// 7. CORS
builder.Services.AddCorsPolicies();

// 8. FluentValidation
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddFluentValidationClientsideAdapters();
builder.Services.AddValidatorsFromAssemblies(AppDomain.CurrentDomain.GetAssemblies());

// Build
var app = builder.Build();

// 9. Обробка винятків
app.UseMiddleware<ExceptionMiddleware>();

// 10. Статичні файли
var dir = Path.Combine(Directory.GetCurrentDirectory(), builder.Configuration.GetValue<string>("ImagesDir") ?? "uploading");
Directory.CreateDirectory(dir);

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(dir),
    RequestPath = "/images"
});

// 11. Swagger у Dev режимі
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 12. Middleware
app.UseAuthentication();
app.UseAuthorization();
app.UseCors("front-end-cors-policy");

// 13. Маршрутизація
app.MapControllers();

// 14. Ініціалізація початкових даних
await app.SeedDataAsync();

// 15. Запуск
app.Run();
