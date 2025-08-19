using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models.Search
{
    public class ProductSearchModel
    {
        public long? CategoryId { get; set; }
        public long? BrandId { get; set; }
        public decimal? PriceMin { get; set; }
        public decimal? PriceMax { get; set; }
        public double? MinRating { get; set; }
        public bool? InStock { get; set; } // Якщо треба перевіряти наявність

        // Дата додавання (пошук по CreatedAt)
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
            if (DateTime.TryParseExact(
                    EndDate,
                    "dd.MM.yyyy",
                    CultureInfo.InvariantCulture,
                    DateTimeStyles.AssumeLocal,
                    out var parsedDate))
            {
                return parsedDate.ToUniversalTime();
            }
            return null;
        }

        // Сортування
        public string? SortBy { get; set; } // "Price", "Rating", "CreatedAt"
        public bool SortDesc { get; set; }

        // Пагінація
        public int Page { get; set; } = 1;
        public int ItemsPerPage { get; set; } = 10;
    }
}
