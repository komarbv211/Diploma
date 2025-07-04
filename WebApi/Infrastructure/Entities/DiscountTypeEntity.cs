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

        // Значення знижки:
        // Якщо DiscountType = "Percent", то це відсоток (20 = 20%)
        // Якщо DiscountType = "Fixed", то це сума в валюті (наприклад, 100 грн)
        [Required]
        public decimal Amount { get; set; } 
    }
}
