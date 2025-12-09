using Microsoft.AspNetCore.Http;
using System.Text.Json;

namespace Core.DTOs.CategoryDTOs
{
    public class CategoryCreateDto
    {
        //public string Name { get; set; } = string.Empty;

        //public string? UrlSlug { get; set; } = string.Empty;

        //public int Priority { get; set; } = 0;

        //public IFormFile? Image { get; set; }

        //public string? Description { get; set; }

        //public long? ParentId { get; set; }


        //public Dictionary<string, CategoryTranslationDto> Translations { get; set; } = new();

        //пробний оновлений варіант
        public string Name { get; set; } = string.Empty;

        public string? UrlSlug { get; set; } = string.Empty;

        public int Priority { get; set; } = 0;

        public IFormFile? Image { get; set; }

        public string? Description { get; set; }

        public long? ParentId { get; set; }

        // JSON рядок з перекладами
        public string? TranslationsJson { get; set; }

        // Десеріалізовані переклади
        public Dictionary<string, CategoryTranslationDto> Translations
        {
            get
            {
                if (string.IsNullOrEmpty(TranslationsJson))
                    return new();

                return JsonSerializer.Deserialize<Dictionary<string, CategoryTranslationDto>>(TranslationsJson)
                       ?? new();
            }
        }
    }
}
