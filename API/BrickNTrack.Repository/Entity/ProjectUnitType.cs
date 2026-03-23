namespace BrickNTrack.Repository.Entity
{
    public class ProjectUnitType : CommonEntity
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public string UnitName { get; set; } = "";  // e.g., "3 BHK Standard", "4 BHK Premium"
        public string? UnitType { get; set; }         // Apartment, Villa, Penthouse, Plot
        public int Bedrooms { get; set; }
        public int Bathrooms { get; set; }
        public double CarpetArea { get; set; }
        public double? SuperBuiltUpArea { get; set; }
        public double Price { get; set; }
        public double? PricePerSqFt { get; set; }
        public string? FacingDirection { get; set; }
        public string? FurnishingStatus { get; set; }
        public int? FloorNumber { get; set; }
        public int? TotalFloors { get; set; }
        public int? ParkingCount { get; set; }
        public int? BalconyCount { get; set; }
        public string? FloorPlanImage { get; set; }
        public int TotalUnits { get; set; }
        public int AvailableUnits { get; set; }

        public ProjectMaster ProjectMaster { get; set; }
    }
}
