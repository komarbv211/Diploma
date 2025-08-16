namespace Core.DTOs.OrderDTOs
{
    public class NovaPostWarehouseDto
    {
        public long Id { get; set; }
        public string? Name { get; set; }
        public string? City { get; set; }
        public string? Address { get; set; }
        public string? WarehouseCode { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string? WorkingHours { get; set; }
        public decimal? MaxWeightKg { get; set; }
    }

    public class NovaPostWarehouseResponse
    {
        public bool Success { get; set; }
        public List<NovaPostWarehouseData> Data { get; set; } = new();
    }

    public class NovaPostWarehouseData
    {
        public string Description { get; set; } = null!;
        public string CityDescription { get; set; } = null!;
        public string Number { get; set; } = null!;
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string TotalMaxWeightAllowed { get; set; } = null!;
        public Dictionary<string, string> Schedule { get; set; } = new();
    }
}
