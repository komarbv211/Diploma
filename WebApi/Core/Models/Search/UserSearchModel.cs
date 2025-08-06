using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models.Search
{
    public class UserSearchModel
    {
        public List<string>? Roles { get; set; }
        public string? Name { get; set; }
        public string? StartDate { get; set; }
        public string? EndDate { get; set; }
     public DateTime? GetParsedStartDate()
{
    if (DateTime.TryParseExact(
            StartDate,
            "dd.MM.yyyy",                         // формат: день.місяць.рік
            CultureInfo.InvariantCulture,
            DateTimeStyles.AssumeLocal,           // або .AssumeUniversal
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
            "dd.MM.yyyy",                         // формат: день.місяць.рік
            CultureInfo.InvariantCulture,
            DateTimeStyles.AssumeLocal,           // або .AssumeUniversal
            out var parsedDate))
    {
        return parsedDate.ToUniversalTime();
    }

    return null;
}


        // Пагінація
        public int Page { get; set; } = 1;
        public int ItemPerPAge { get; set; } = 10;

        // 🔽 Сортування
        public string? SortBy { get; set; } // Наприклад: "FirstName", "Email", "Role"
        public bool SortDesc { get; set; } = false; // За замовчуванням — ASC
    }
}
