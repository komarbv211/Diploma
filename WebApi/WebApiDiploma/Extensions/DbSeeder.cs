﻿using Newtonsoft.Json;
using System.Text;
using Infrastructure.Entities;
using WebApiDiploma.Models.Seeder;
using Core.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace WebApiDiploma.Extensions
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


            //Advert seeder
            //var filterValueRepo = scope.ServiceProvider.GetService<IRepository<FilterValue>>();
            //var settlementRepo = scope.ServiceProvider.GetService<IRepository<Settlement>>();
            //var advertRepo = scope.ServiceProvider.GetService<IRepository<Advert>>();
            //if (advertRepo is not null && !await advertRepo.AnyAsync())
            //{
            //    Console.WriteLine("Start adverts seeder");
            //    string advertsJsonDataFile = Path.Combine(Environment.CurrentDirectory, app.Configuration["SeederJsonDir"]!, "Adverts.json");
            //    if (File.Exists(advertsJsonDataFile))
            //    {
            //        var advertsJson = File.ReadAllText(advertsJsonDataFile, Encoding.UTF8);
            //        try
            //        {
            //            var advertModels = JsonConvert.DeserializeObject<IEnumerable<SeederAdvertModel>>(advertsJson)
            //                ?? throw new JsonException();
            //            if (advertModels.Any() && filterValueRepo is not null)
            //            {
            //                var advertsTasks = advertModels.Select(async (x) =>
            //                {
            //                    var filterValues = filterValueRepo.GetListBySpec(new FilterValueSpecs.GetByIds(x.FilterValueIds)).Result.ToList();
            //                    var imagesTasks = x.ImagePaths.Select(async (path, index) =>
            //                        new AdvertImage()
            //                        {
            //                            Priority = index,
            //                            Name = await imageService.SaveImageFromUrlAsync(path)
            //                        });
            //                    var images = await Task.WhenAll(imagesTasks);
            //                    return new Advert()
            //                    {
            //                        UserId = x.UserId,
            //                        PhoneNumber = x.PhoneNumber,
            //                        ContactEmail = x.ContactEmail,
            //                        ContactPersone = x.ContactPersone,
            //                        Title = x.Title,
            //                        Description = x.Description,
            //                        IsContractPrice = x.IsContractPrice,
            //                        Price = x.Price,
            //                        CategoryId = x.CategoryId,
            //                        FilterValues = filterValues,
            //                        Images = images,
            //                        Approved = true,
            //                        Settlement = await settlementRepo.GetByIDAsync(x.SettlementRef) ??
            //                          throw new NullReferenceException("settlement not found")
            //                    };
            //                });
            //                var adverts = await Task.WhenAll(advertsTasks);
            //                Console.WriteLine($"Adding {adverts.Length} adverts to the database.");
            //                await advertRepo.AddRangeAsync(adverts);
            //                await advertRepo.SaveAsync();
            //                Console.WriteLine("Adverts added to the database.");
            //            }
            //        }
            //        catch (JsonException)
            //        {
            //            Console.WriteLine("Error deserialize adverts json file");
            //        }
            //    }
            //    else Console.WriteLine("File \"Adverts.json\" not found");
            //}
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
