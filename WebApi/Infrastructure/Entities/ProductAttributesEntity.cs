using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Entities
{
    public class ProductAttributesEntity : BaseEntity<long>
    {

        [Range(18, 99, ErrorMessage = "Вік повинен бути від 18 до 99 років")]
        public int Age { get; set; } = 18;

        //[Required(ErrorMessage = "Серія є обов'язковою")]
        //public string Series { get; set; } = string.Empty;

        //[Required(ErrorMessage = "Група товару є обов'язковою")]
        //public string ProductGroup { get; set; } = string.Empty;

        [Required(ErrorMessage = "Колір є обов'язковим")]
        public string Color { get; set; } = string.Empty;

        [Required(ErrorMessage = "Призначення є обов'язковим")]
        public List<string> Purposes { get; set; } = new List<string>();

        [Required(ErrorMessage = "Стать є обов'язковою")]
        public string Gender { get; set; } = "Для жінок";

        [Required(ErrorMessage = "Об'єм є обов'язковим")]
        public string Volume { get; set; } = string.Empty;

        [Required(ErrorMessage = "Формула засобу є обов'язковою")]
        public string Formula { get; set; } = string.Empty;

        [Required(ErrorMessage = "Класифікація є обов'язковою")]
        public string Classification { get; set; } = string.Empty;

        [Required(ErrorMessage = "Країна ТМ є обов'язковою")]
        public string BrandCountry { get; set; } = string.Empty;

        [Required(ErrorMessage = "Країна виробництва є обов'язковою")]
        public string MadeIn { get; set; } = string.Empty;


        [ForeignKey("Category")]
        public long CategoryId { get; set; }
        public virtual CategoryEntity? Category { get; set; }
    }

}
