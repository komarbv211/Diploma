using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Core.Models.Search
{
    public class ProductSearchModel
    {
        // 🔍 Фільтри
        public long? CategoryId { get; set; }
        //public long? BrandId { get; set; }

        [JsonPropertyName("brandIds[]")]
        public long? [] BrandIds { get; set; }


        public int? PriceMin { get; set; }
        public int? PriceMax { get; set; }

        public double? MinRating { get; set; }

        public bool? InStock { get; set; } // Кількість > 0

        public string? Query { get; set; } // Пошук по назві чи опису

        // 📅 Дата додавання
        public string? StartDate { get; set; }
        public string? EndDate { get; set; }


        public DateTime? GetParsedStartDate()
        {
            if (DateTime.TryParseExact(
                    StartDate,
                    "dd.MM.yyyy",
                    CultureInfo.InvariantCulture,
                    DateTimeStyles.AssumeLocal,
                    out var parsedDate))
            {
                return parsedDate.ToUniversalTime();
            }
            return null;
        }


        public DateTime? GetParsedEndDate()
        {
            return ParseDate(EndDate)?.AddDays(1).AddTicks(-1); // включно до кінця дня
        }

        private DateTime? ParseDate(string? dateStr)
        {
            if (DateTime.TryParseExact(
                    dateStr,
                    "dd.MM.yyyy",
                    CultureInfo.InvariantCulture,
                    DateTimeStyles.AssumeLocal,
                    out var parsedDate))
            {
                return parsedDate.ToUniversalTime();
            }
            return null;
        }

        // ↕️ Сортування
        public string? SortBy { get; set; } // "Price", "Rating", "CreatedAt"
        public bool SortDesc { get; set; } = false;

        // 📄 Пагінація
        public int Page { get; set; } = 1;
        public int ItemPerPage { get; set; } = 10;

        // 📌 Допустимі поля сортування
        public static class SortFields
        {
            public const string Price = "Price";
            public const string Rating = "Rating";
            public const string CreatedAt = "CreatedAt";
        }


    }
}
