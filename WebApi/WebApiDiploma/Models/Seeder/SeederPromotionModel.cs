using Infrastructure.Entities;

namespace WebApiDiploma.Models.Seeder
{
    public class SeederPromotionModel
    {
        public string Name { get; set; }
        public string? Description { get; set; }

        // "Percent" або "Fixed"
        public string DiscountType { get; set; }

        // Значення знижки (у відсотках або грн, залежно від типу)
        public decimal DiscountValue { get; set; }

        // URL або шлях до зображення акції
        public string? Image { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public bool IsActive { get; set; }

        // ID категорії, якщо акція на всю категорію
        public long? CategoryId { get; set; }

        // Список ID продуктів, до яких застосовується акція
        public List<long>? ProductIds { get; set; }
    }

}
