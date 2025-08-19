using Core.Interfaces;
using Core.Models.Enums;
using Core.Services;
using Infrastructure.Entities;
using Infrastructure.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
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
            var roleManager = serviceProvider.GetRequiredService<RoleManager<RoleEntity>>();

            if (!await roleManager.RoleExistsAsync("Admin"))
                await roleManager.CreateAsync(new RoleEntity { Name = "Admin" });
            if (!await roleManager.RoleExistsAsync("User"))
                await roleManager.CreateAsync(new RoleEntity { Name = "User" });



            //NewPost seeder
            //using (var newPostService = scope.ServiceProvider.GetRequiredService<INewPostService>())
            //{
            //    var areaRepo = scope.ServiceProvider.GetRequiredService<IRepository<Area>>();
            //    if (!await areaRepo.AnyAsync())
            //    {
            //        await newPostService.UpdateNewPostData();
            //    }
            //}



            // Users seeder
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



            //Filter seeder
            //var filterRepo = scope.ServiceProvider.GetService<IRepository<Filter>>();
            //if (filterRepo is not null && !await filterRepo.AnyAsync())
            //{
            //    Console.WriteLine("Start filters seeder");
            //    string filtersJsonDataFile = Path.Combine(Environment.CurrentDirectory, app.Configuration["SeederJsonDir"]!, "Filters.json");
            //    if (File.Exists(filtersJsonDataFile))
            //    {
            //        var filtersJson = File.ReadAllText(filtersJsonDataFile, Encoding.UTF8);
            //        try
            //        {
            //            var filtersModels = JsonConvert.DeserializeObject<IEnumerable<SeederFilterModel>>(filtersJson)
            //                ?? throw new JsonException();
            //            if (filtersModels.Any())
            //            {
            //                var filters = filtersModels.Select(x => new Filter()
            //                {
            //                    Name = x.Name,
            //                    Values = x.Values.Select(z => new FilterValue() { Value = z }).ToList()
            //                });
            //                await filterRepo.AddRangeAsync(filters);
            //                await filterRepo.SaveAsync();
            //            }
            //        }
            //        catch (JsonException)
            //        {
            //            Console.WriteLine("Error deserialize filters json file");
            //        }
            //    }
            //    else Console.WriteLine("File \"JsonData/Filter.json\" not found");
            //}

            //Category seeder

            var categoryRepo = scope.ServiceProvider.GetService<IRepository<CategoryEntity>>();
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


            //product seeder
            //var filterValueRepo = scope.ServiceProvider.GetService<IRepository<FilterValue>>();
            //var settlementRepo = scope.ServiceProvider.GetService<IRepository<Settlement>>();
            var ProductRepo = scope.ServiceProvider.GetService<IRepository<ProductEntity>>();
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

            // ProductRating seeder
            var productRatingRepo = scope.ServiceProvider.GetService<IRepository<ProductRatingEntity>>();
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

            var promotionRepo = scope.ServiceProvider.GetService<IRepository<PromotionEntity>>();
var productRepo = scope.ServiceProvider.GetService<IRepository<ProductEntity>>();

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



            var orderRepo = scope.ServiceProvider.GetService<IRepository<OrderEntity>>();
            var warehouseRepo = scope.ServiceProvider.GetService<IRepository<NovaPostWarehouseEntity>>();

            await SeedOrdersAsync(scope.ServiceProvider, orderRepo, warehouseRepo);

        }

        private static async Task SeedOrdersAsync(
            IServiceProvider serviceProvider,
            IRepository<OrderEntity>? orderRepo,
            IRepository<NovaPostWarehouseEntity>? warehouseRepo)
        {
            //var newPostService = serviceProvider.GetRequiredService<NovaPoshtaService>();
            //await newPostService.UpdateWarehousesAsync();

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




        //private async static Task<IEnumerable<CategoryEntity>> GetCategories(
        //        IEnumerable<CategoryEntity> models,
        //        IEnumerable<Filter> filters,
        //        IImageService imageService)
        //    {
        //        var categoryTasks = models.Select(async (x) =>
        //        {
        //            var advertFilters = x.Filters?.Any() ?? false ? filters.Where(z => x.Filters.Contains(z.Name)) : null;
        //            var childs = x.Childs?.Any() ?? false ? await GetCategories(x.Childs, filters, imageService) : null;
        //            var image = !String.IsNullOrEmpty(x.Image)
        //                ? await imageService.SaveImageFromUrlAsync(x.Image)
        //                : null;
        //            return new Category()
        //            {
        //                Name = x.Name,
        //                Image = image,
        //                Filters = advertFilters?.ToArray() ?? [],
        //                Childs = childs?.ToArray() ?? []
        //            };
        //        });
        //        var categories = await Task.WhenAll(categoryTasks);
        //        return categories;
        //    }







    }
}
