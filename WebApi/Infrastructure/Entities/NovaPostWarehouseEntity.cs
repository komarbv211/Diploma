using System.ComponentModel.DataAnnotations;

namespace Infrastructure.Entities
{
    public class NovaPostWarehouseEntity : BaseEntity<long>
    {
        [StringLength(255)]
        public required string Name { get; set; }

        [StringLength(255)]
        public required string City { get; set; }

        [StringLength(50)]
        public string? CityRef { get; set; }
        public string? Region { get; set; }
        public string? RegionRef { get; set; }

        [StringLength(255)]
        public required string Address { get;   set; }

        [StringLength(255)]
        public required string WarehouseCode { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string? WorkingHours { get; set; }
        public decimal? MaxWeightKg { get; set; }

        [StringLength(100)]
        public string? WarehouseType { get; set; }
        public DateTime? LastSyncedAt { get; set; }
        public bool IsActive { get; set; } = true;

        public virtual ICollection<OrderEntity> Orders { get; set; } = new List<OrderEntity>();
    }
}
