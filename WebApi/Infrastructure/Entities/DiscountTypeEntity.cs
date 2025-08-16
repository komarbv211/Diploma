using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Entities
{
    public class DiscountTypeEntity :  BaseEntity<long>
    {
        // Тип знижки:
        // "Percent" — означає знижку у відсотках
        // "Fixed" — означає фіксовану суму знижки (наприклад, -100 грн)
        [Required, StringLength(50)]
        public string Name { get; set; } = string.Empty;

    }
}
