using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Entities
{
    //public class PromotionEntity : BaseEntity<long>
    //{
    //    // Назва акції, яка буде показана користувачам (наприклад, "Літній розпродаж")
    //    [Required, StringLength(255)]
    //    public string Name { get; set; }

    //    // Розширений опис акції, що пояснює її умови
    //    [StringLength(4000)]
    //    public string? Description { get; set; }

    //    // Зображення акції (наприклад, банер для показу на сайті)
    //    // Може бути шлях до файлу або URL
    //    [Required]
    //    public string? Image { get; set; }

    //    // Дата початку дії акції
    //    [Required]
    //    public DateTime StartDate { get; set; }

    //    // Дата завершення дії акції
    //    [Required]
    //    public DateTime EndDate { get; set; }

    //    // Прапорець, який вмикає або вимикає акцію вручну (навіть якщо вона в межах дат)
    //    public bool IsActive { get; set; } = true;

    //    // Опціональне поле: якщо вказано, акція діє на всю категорію товарів
    //    [ForeignKey("Category")]
    //    public long? CategoryId { get; set; }

    //    // Навігаційна властивість до категорії, якщо акція пов'язана з категорією
    //    public virtual CategoryEntity? Category { get; set; }

    //    // Список конкретних продуктів, до яких застосовується акція
    //    // Може бути використано, якщо акція не на всю категорію, а тільки на вибрані товари
    //    //public virtual ICollection<ProductEntity>? Products { get; set; }


    //    public virtual ICollection<PromotionProductEntity>? PromotionProducts { get; set; }



    //    // 🔗 Знижка
    //    [ForeignKey("DiscountType")]
    //    public long DiscountTypeId { get; set; }
    //    public virtual DiscountTypeEntity DiscountType { get; set; }
    //}
}
