using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models.Search
{
    public class ProductItemModel
    {
        public long Id { get; set; }
        public string Name { get; set; } = default!;
        public int Price { get; set; }
        public double? Rating { get; set; }
        public string ImageUrl { get; set; } = default!; // ← оце і потрібно
        public string? BrandName { get; set; }
        public string? CategoryName { get; set; }
        public bool IsInStock { get; set; }
        public int Quantity { get; set; }
        public DateTime CreatedAt { get; set; } // 🆕 Додали дату створення

        public bool IsFavorite { get; set; } = false;

    }
}
