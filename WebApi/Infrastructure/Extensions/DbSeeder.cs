using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
﻿using Microsoft.AspNetCore.Identity;
using static System.Formats.Asn1.AsnWriter;
using Microsoft.Graph.Models;
using Infrastructure.Entities;

namespace Infrastructure.Extensions
{
    public static class DbSeeder
    {
          public static async Task SeedDataAsync(this WebApplication app)
        {

            using var scope = app.Services.CreateScope();
         //Category seeder
            var categoryRepo = scope.ServiceProvider.GetService<IRepository<Category>>();
            if (categoryRepo is not null && !await categoryRepo.AnyAsync())
            {
                Console.WriteLine("Start categories seeder");
                string categoryJsonDataFile = Path.Combine(Environment.CurrentDirectory, app.Configuration["SeederJsonDir"]!,"Categories.json");
                if (File.Exists(categoryJsonDataFile))
                {
                    var filtersJson = File.ReadAllText(categoryJsonDataFile, Encoding.UTF8);
                    try
                    {
                        var categoryModels = JsonConvert.DeserializeObject<IEnumerable<CategoryEntity>>(filtersJson)
                            ?? throw new JsonException();
                        if (categoryModels.Any() && filterRepo is not null)
                        {
                            var filters = await filterRepo.GetListBySpec(new FilterSpecs.GetAll());
                            await categoryRepo.AddRangeAsync(await GetCategories(categoryModels, filters,imageService));
                            await categoryRepo.SaveAsync();
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

    }
}
