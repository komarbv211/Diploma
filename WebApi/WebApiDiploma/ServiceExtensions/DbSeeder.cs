using Core.Interfaces;
using Core.Services;
using Infrastructure.Data;
using Infrastructure.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Text;
using WebApiDiploma.Models.Seeder;

namespace WebApiDiploma.ServiceExtensions
{
    public static class DbSeeder
    {

        public static async Task SeedDataAsync(this WebApplication app)
        {
            //Roles seeder
            using var scope = app.Services.CreateScope();
            var serviceProvider = scope.ServiceProvider;

            await InitDatabaseAsync(serviceProvider);

            await SeedRolesAsync(serviceProvider);

            await SeedUsersAsync(app,serviceProvider);

            await SeedCategoriesAsync(app, serviceProvider);

            await SeedProductsAsync(app, serviceProvider);

            await SeedProductRatingAsync(app, serviceProvider);

            await SeedBrandsAsync(app, serviceProvider);

            await SeedPromotionsAsync(app, serviceProvider);

            await SeedCommentsAsync(app, serviceProvider);

            await SeedOrdersAsync(serviceProvider);
        }

        private static async Task InitDatabaseAsync(IServiceProvider serviceProvider)
        {
            var context = serviceProvider.GetRequiredService<DbMakeUpContext>();
            await context.Database.MigrateAsync();
        }

        private static async Task SeedRolesAsync(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<RoleEntity>>();

            if (!await roleManager.RoleExistsAsync("Admin"))
                await roleManager.CreateAsync(new RoleEntity { Name = "Admin" });
            if (!await roleManager.RoleExistsAsync("User"))
                await roleManager.CreateAsync(new RoleEntity { Name = "User" });
        }

        private static async Task SeedUsersAsync(WebApplication app, IServiceProvider serviceProvider)
        {
            var userManager = serviceProvider.GetRequiredService<UserManager<UserEntity>>();

            var imageService = serviceProvider.GetRequiredService<IImageService>();
            if (!userManager.Users.Any())
            {
                Console.WriteLine("Start users seeder");
                string usersJsonDataFile = Path.Combine(Environment.CurrentDirectory, "Helpers", app.Configuration["SeederJsonDir"]!, "Users.json");
                if (File.Exists(usersJsonDataFile))
                {
                    var userJson = File.ReadAllText(usersJsonDataFile, Encoding.UTF8);
                    try
                    {
                        var usersData = JsonConvert.DeserializeObject<IEnumerable<SeederUserModel>>(userJson)
                            ?? throw new JsonException();
                        foreach (var user in usersData)
                        {
                            var newUser = new UserEntity
                            {
                                UserName = user.Email,
                                Email = user.Email,
                                PhoneNumber = user.PhoneNumber,
                                FirstName = user.FirstName,
                                LastName = user.LastName,
                                Image = user.PhotoBase64 is not null
                                ? await imageService.SaveImageAsync(user.PhotoBase64)
                                : await imageService.SaveImageFromUrlAsync(user.PhotoUrl ?? "https://picsum.photos/800/600"),
                                //WebSite = user.WebSite,
                                //About = user.About,
                                EmailConfirmed = true
                            };

                            var result = await userManager.CreateAsync(newUser, user.Password);
                            if (result.Succeeded)
                                await userManager.AddToRoleAsync(newUser, user.Role);
                            else
                                Console.WriteLine($"Error create user \"{user.Email}\"");
                        }
                    }
                    catch (JsonException)
                    {
                        Console.WriteLine("Error deserialize users json file");
                    }
                }
                else Console.WriteLine("File \"JsonData/Users.json\" not found");
            }
        }

        private static async Task SeedCategoriesAsync(WebApplication app, IServiceProvider serviceProvider)
        {
            var categoryRepo = serviceProvider.GetService<IRepository<CategoryEntity>>();
            var imageService = serviceProvider.GetRequiredService<IImageService>();

            if (categoryRepo is not null && !await categoryRepo.AnyAsync())
            {
                Console.WriteLine("Start categories seeder");
                string categoryJsonDataFile = Path.Combine(Environment.CurrentDirectory, "Helpers", app.Configuration["SeederJsonDir"]!, "Categories.json");
                if (File.Exists(categoryJsonDataFile))
                {
                    var filtersJson = File.ReadAllText(categoryJsonDataFile, Encoding.UTF8);
                    try
                    {
                        var categoryModels = JsonConvert.DeserializeObject<IEnumerable<SeederCategoryModel>>(filtersJson)
                            ?? throw new JsonException();
                        foreach (var categoryModel in categoryModels)
                        {
                            var parent = new CategoryEntity
                            {
                                Description = categoryModel.Description,
                                Name = categoryModel.Name,
                                ParentId = null,
                                Priority = categoryModel.Priority,
                                UrlSlug = categoryModel.UrlSlug
                            };
                            await categoryRepo.AddAsync(parent);
                            await categoryRepo.SaveAsync();

                            foreach (var malvina in categoryModel.Children)
                            {
                                var child = new CategoryEntity
                                {
                                    Description = malvina.Description,
                                    Name = malvina.Name,
                                    ParentId = parent.Id,
                                    Priority = malvina.Priority,
                                    UrlSlug = malvina.UrlSlug
                                };
                                await categoryRepo.AddAsync(child);
                                await categoryRepo.SaveAsync();
                            }
                        }
                    }
                    catch (JsonException)
                    {
                        Console.WriteLine("Error deserialize categories json file");
                    }
                }
                else Console.WriteLine("File \"JsonData/Categories.json\" not found");
            }
        }

        private static async Task SeedProductsAsync(WebApplication app, IServiceProvider serviceProvider)
        {
            var ProductRepo = serviceProvider.GetService<IRepository<ProductEntity>>();
            var imageService = serviceProvider.GetRequiredService<IImageService>();
            if (ProductRepo is not null && !await ProductRepo.AnyAsync())
            {
                Console.WriteLine("Start adverts seeder");
                string productJsonDataFile = Path.Combine(Environment.CurrentDirectory, "Helpers", app.Configuration["SeederJsonDir"]!, "Product.json");
                if (File.Exists(productJsonDataFile))
                {
                    var productJson = File.ReadAllText(productJsonDataFile, Encoding.UTF8);
                    try
                    {
                        var productModels = JsonConvert.DeserializeObject<IEnumerable<SeederProductModel>>(productJson)
                            ?? throw new JsonException();
                        //if (productModels.Any() && filterValueRepo is not null)
                        //{
                        var productTasks = productModels.Select(async (x) =>
                        {
                            //var filterValues = filterValueRepo.GetListBySpec(new FilterValueSpecs.GetByIds(x.FilterValueIds)).Result.ToList();
                            var imagesTasks = x.ImagePaths.Select(async (path, index) =>
                                new ProductImageEntity()
                                {
                                    Priority = (short)index,
                                    Name = await imageService.SaveImageFromUrlAsync(path)
                                });
                            var images = await Task.WhenAll(imagesTasks);
                            return new ProductEntity()
                            {
                                Name = x.Name,
                                Price = x.Price,
                                Description = x.Description,
                                CategoryId = x.CategoryId,
                                Images = images,
                            };
                        });
                        var products = await Task.WhenAll(productTasks);
                        Console.WriteLine($"Adding {products.Length} adverts to the database.");
                        await ProductRepo.AddRangeAsync(products);

                        await ProductRepo.SaveAsync();
                        Console.WriteLine("Adverts added to the database.");
                        //}
                    }
                    catch (JsonException)
                    {
                        Console.WriteLine("Error deserialize adverts json file");
                    }
                }
                else Console.WriteLine("File \"Adverts.json\" not found");
            }

        }
        
        private static async Task SeedProductRatingAsync(WebApplication app, IServiceProvider serviceProvider)
        {

            var productRatingRepo = serviceProvider.GetService<IRepository<ProductRatingEntity>>();
            if (productRatingRepo is not null && !await productRatingRepo.AnyAsync())
            {
                Console.WriteLine("Start product ratings seeder");
                string ratingsJsonPath = Path.Combine(Environment.CurrentDirectory, "Helpers", app.Configuration["SeederJsonDir"]!, "ProductRatings.json");
                if (File.Exists(ratingsJsonPath))
                {
                    var ratingsJson = File.ReadAllText(ratingsJsonPath, Encoding.UTF8);
                    try
                    {
                        var ratingModels = JsonConvert.DeserializeObject<IEnumerable<SeederProductRatingModel>>(ratingsJson)
                                           ?? throw new JsonException();

                        var ratings = ratingModels.Select(x => new ProductRatingEntity
                        {
                            Id = x.Id,
                            ProductId = x.ProductId,
                            UserId = x.UserId,
                            Rating = x.Rating
                        });

                        await productRatingRepo.AddRangeAsync(ratings);
                        await productRatingRepo.SaveAsync();
                        Console.WriteLine("Product ratings seeded successfully.");
                    }
                    catch (JsonException)
                    {
                        Console.WriteLine("Error deserialize ProductRatings.json");
                    }
                }
                else Console.WriteLine("File \"ProductRatings.json\" not found");
            }
        }
        
        private static async Task SeedBrandsAsync(WebApplication app, IServiceProvider serviceProvider)
        {
            //Brands seeder
            var brandRepo = serviceProvider.GetService<IRepository<BrandEntity>>();

            if (brandRepo is not null && !await brandRepo.AnyAsync())
            {
                Console.WriteLine("Start brand seeder");
                string brandJsonDataFile = Path.Combine(Environment.CurrentDirectory, "Helpers", app.Configuration["SeederJsonDir"]!, "Brand.json");
                if (File.Exists(brandJsonDataFile))
                {
                    var filtersJson = File.ReadAllText(brandJsonDataFile, Encoding.UTF8);
                    try
                    {
                        var brandModels = JsonConvert.DeserializeObject<IEnumerable<SeederBrandModel>>(filtersJson)
                            ?? throw new JsonException();
                        foreach (var brandModel in brandModels)
                        {
                            var parent = new BrandEntity
                            {
                                Name = brandModel.Name
                            };
                            await brandRepo.AddAsync(parent);
                            await brandRepo.SaveAsync();
                        }
                    }
                    catch (JsonException)
                    {
                        Console.WriteLine("Error deserialize brands json file");
                    }
                }
                else Console.WriteLine("File \"JsonData/Brand.json\" not found");
            }
        }

        private static async Task SeedPromotionsAsync(WebApplication app, IServiceProvider serviceProvider)
        {
            var promotionRepo = serviceProvider.GetService<IRepository<PromotionEntity>>();
            var productRepo = serviceProvider.GetService<IRepository<ProductEntity>>();

            if (promotionRepo is not null && !await promotionRepo.AnyAsync())
            {
                Console.WriteLine("Start promotions seeder");

                string promotionJsonPath = Path.Combine(Environment.CurrentDirectory, "Helpers", app.Configuration["SeederJsonDir"]!, "Promotion.json");

                if (File.Exists(promotionJsonPath))
                {
                    var promotionJson = File.ReadAllText(promotionJsonPath, Encoding.UTF8);
                    try
                    {
                        var promotionModels = JsonConvert.DeserializeObject<List<SeederPromotionModel>>(promotionJson)
                                              ?? throw new JsonException();

                        foreach (var model in promotionModels)
                        {
                            // Створюємо акцію
                            var promotion = new PromotionEntity
                            {
                                Name = model.Name,
                                Description = model.Description,
                                Image = model.Image,
                                StartDate = model.StartDate.ToUniversalTime(),
                                EndDate = model.EndDate.ToUniversalTime(),
                                IsActive = model.IsActive
                            };

                            await promotionRepo.AddAsync(promotion);
                            await promotionRepo.SaveAsync();

                            // Прив’язка продуктів до акції
                            if (model.ProductIds is not null && model.ProductIds.Any() && productRepo is not null)
                            {
                                foreach (var productId in model.ProductIds)
                                {
                                    var product = await productRepo!.GetByID(productId);
                                    if (product != null)
                                    {
                                        product.PromotionId = promotion.Id;
                                    }
                                }
                                await productRepo.SaveAsync();
                            }
                        }

                        Console.WriteLine("Promotions seeded successfully.");
                    }
                    catch (JsonException)
                    {
                        Console.WriteLine("❌ Error: Не вдалося десеріалізувати Promotions.json");
                    }
                }
                else
                {
                    Console.WriteLine("❌ Promotions.json не знайдено");
                }
            }
        }

        private static async Task SeedCommentsAsync(WebApplication app, IServiceProvider serviceProvider)
        {
            var commentRepo = serviceProvider.GetService<IRepository<CommentEntity>>();
            if (commentRepo is not null && !await commentRepo.AnyAsync())
            {
                Console.WriteLine("Start comments seeder");

                string commentsJsonPath = Path.Combine(
                    Environment.CurrentDirectory,
                    "Helpers",
                    app.Configuration["SeederJsonDir"]!,
                    "Comments.json"
                );

                if (File.Exists(commentsJsonPath))
                {
                    var commentsJson = File.ReadAllText(commentsJsonPath, Encoding.UTF8);
                    try
                    {
                        var commentModels = JsonConvert.DeserializeObject<IEnumerable<SeederCommentModel>>(commentsJson)
                                            ?? throw new JsonException();

                        var comments = commentModels.Select(x => new CommentEntity
                        {
                            ProductId = x.ProductId,
                            UserId = x.UserId,
                            Text = x.Text,
                            DateCreated = DateTime.UtcNow // або взяти з JSON, якщо є
                        });

                        await commentRepo.AddRangeAsync(comments);
                        await commentRepo.SaveAsync();

                        Console.WriteLine("Comments seeded successfully.");
                    }
                    catch (JsonException)
                    {
                        Console.WriteLine("❌ Error deserialize Comments.json");
                    }
                }
                else
                {
                    Console.WriteLine("❌ Comments.json not found");
                }
            }

        }

        private static async Task SeedOrdersAsync(IServiceProvider serviceProvider)
        {
            var orderRepo = serviceProvider.GetService<IRepository<OrderEntity>>();
            var warehouseRepo = serviceProvider.GetService<IRepository<NovaPostWarehouseEntity>>();

            var newPostService = serviceProvider.GetRequiredService<NovaPoshtaService>();
            
            if(!warehouseRepo!.GetAllQueryable().Any())
                await newPostService.UpdateWarehousesAsync();

            if (orderRepo == null || await orderRepo.AnyAsync())
                return;

            Console.WriteLine("Seeding Orders...");

            var ordersJson = File.ReadAllText(Path.Combine(Environment.CurrentDirectory, "Helpers", "JsonData", "Orders.json"));
            var orderItemsJson = File.ReadAllText(Path.Combine(Environment.CurrentDirectory, "Helpers", "JsonData", "OrderItems.json"));

            var orders = JsonConvert.DeserializeObject<List<OrderEntity>>(ordersJson);
            var orderItems = JsonConvert.DeserializeObject<List<OrderItemEntity>>(orderItemsJson);

            foreach (var order in orders!)
            {
                order.Items = orderItems!.Where(i => i.OrderId == order.Id).ToList();
            }

            await orderRepo.AddRangeAsync(orders!);
            await orderRepo.SaveAsync();

            Console.WriteLine($"Orders seeded: {orders!.Count}, OrderItems seeded: {orderItems!.Count}");
        }

    }
}
