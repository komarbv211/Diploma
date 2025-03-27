﻿using Infrastructure.Entities;

namespace WebApiDiploma.Models.Seeder
{
    public class SeederCategoryModel
    {
        public string Name { get; init; } = string.Empty;
        public string? Image { get; init; }
        public IEnumerable<SeederCategoryModel>? Childs { get; init; }
        public IEnumerable<String>? Filters { get; init; }
    }
}
