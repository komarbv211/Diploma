using Core.Exceptions;
using Core.Extensions;
using Core.Models;
using FluentValidation;
using Infrastructure.Data;
using Infrastructure.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using WebApiDiploma.Filters;
using WebApiDiploma.ServiceExtensions;

var builder = WebApplication.CreateBuilder(args);

// Підключення бази даних
builder.Services.AddDbContext<DbMakeUpContext>(opt =>
{
    opt.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// Identity
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

// Власні сервіси

builder.Services.AddWebApiServices();
builder.Services.AddCoreServices();

// Controllers
builder.Services.AddControllers();

// JWT автентифікація та авторизація
builder.Services.AddJwtOptions(builder.Configuration);
var jwtOpts = builder.Configuration.GetSection(nameof(JwtOptions)).Get<JwtOptions>()!;
builder.Services.AddJwtAuthentication(jwtOpts);
builder.Services.AddAuthorizationPolicies();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(); // основний
builder.Services.AddSwaggerJWT(); // +JWT

// CORS
builder.Services.AddCorsPolicies();


// Вимикаємо автоматичну валідацію через ModelState

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.SuppressModelStateInvalidFilter = true;
});

// FluentValidation
builder.Services.AddValidatorsFromAssemblies(AppDomain.CurrentDomain.GetAssemblies());
 
builder.Services.AddMvc(options =>
{
    options.Filters.Add<ValidationFilter>();
});

// Build
var app = builder.Build();

// Обробка винятків
app.UseMiddleware<ExceptionMiddleware>();

// Статичні файли
var dir = Path.Combine(Directory.GetCurrentDirectory(), builder.Configuration.GetValue<string>("ImagesDir") ?? "uploading");
Directory.CreateDirectory(dir);

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(dir),
    RequestPath = "/images"
});

// Swagger у Dev режимі

    app.UseSwagger();
    app.UseSwaggerUI();


// Middleware
app.UseAuthentication();
app.UseAuthorization();
app.UseCors("front-end-cors-policy");

// 13. Маршрутизація
app.MapControllers();

// Ініціалізація початкових даних
await app.SeedDataAsync();

// Запуск
app.Run();
