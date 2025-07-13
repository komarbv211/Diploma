namespace WebApiDiploma.Models.Search
{
    public class UserSearchModel
    {
        public List<string>? Roles { get; set; }
        public string? Name { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        // Пагінація
        public int Page { get; set; } = 1;
        public int ItemPerPAge { get; set; } = 10;

        // 🔽 Сортування
        public string? SortBy { get; set; } // Наприклад: "FirstName", "Email", "Role"
        public bool SortDesc { get; set; } = false; // За замовчуванням — ASC
    }
}
