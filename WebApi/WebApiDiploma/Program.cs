using Core.Exceptions;
using Core.Extensions;
using Core.Interfaces;
using Core.Services;
using FluentValidation;
using FluentValidation.AspNetCore;
using Infrastructure.Data;
using Infrastructure.Entities;
using Infrastructure.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using SixLabors.ImageSharp.Metadata.Profiles.Xmp;
using WebApiDiploma.Extensions;
using WebApiDiploma.ServiceExtensions;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<DbMakeUpContext>(opt =>
{
    opt.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});

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

//builder.Services.AddAutoMapper(typeof(AppProfile));
builder.Services.AddScoped<IUserService, UserService>();//
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();

builder.Services.AddWebApiServices();

builder.Services.AddCoreServices();
builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


//fluent validators
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddFluentValidationClientsideAdapters();
builder.Services.AddValidatorsFromAssemblies(AppDomain.CurrentDomain.GetAssemblies());

builder.Services.AddCorsPolicies();

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

var dir = Path.Combine(Directory.GetCurrentDirectory(), builder.Configuration.GetValue<string>("ImagesDir") ?? "uploading");

Directory.CreateDirectory(dir);

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(dir),
    RequestPath = "/images"    
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.UseCors("front-end-cors-policy");

app.MapControllers();

await app.SeedDataAsync();

app.Run();
