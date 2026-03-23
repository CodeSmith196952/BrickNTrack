using Microsoft.AspNetCore.Connections;

namespace BrickNTrack.Repository.Entity
{
    public class ProjectMaster : CommonEntity
    {
        public int ProjectId { get; set; }
        public string ProjectName { get; set; }
        public string ProjectDescription { get; set; }
        public int CompletionPercentage { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? CompletionDate { get; set; }
        public DateTime? ActualStartDate { get; set; }
        public DateTime? ActualCompletionDate { get; set; }
        public string ProjectAddress { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string? Locality { get; set; }
        public string ProfileImage {  get; set; }
        public string ReraNumber { get; set; }
        public double Budget {  get; set; }
        public string Status { get; set; }
        public string? PropertyType { get; set; }
        public int? Bedrooms { get; set; }
        public int? Bathrooms { get; set; }
        public double? AreaSqFt { get; set; }
        public double? PricePerSqFt { get; set; }
        public string? PossessionStatus { get; set; }
        public string? ApprovalType { get; set; }
        public string? HMDANumber { get; set; }
        public string? DTCPNumber { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Pincode { get; set; }
        public string? Amenities { get; set; }
        public bool IsFeatured { get; set; }
        public double? CarpetArea { get; set; }
        public double? SuperBuiltUpArea { get; set; }
        public string? FurnishingStatus { get; set; }
        public string? FacingDirection { get; set; }
        public int? FloorNumber { get; set; }
        public int? TotalFloors { get; set; }
        public int? ParkingCount { get; set; }
        public string? ParkingType { get; set; }
        public int? BalconyCount { get; set; }
        public string? TransactionType { get; set; }
        public string? OwnershipType { get; set; }
        public double? MaintenanceCharges { get; set; }
        public string? FloorPlanImage { get; set; }
        public string? VideoTourUrl { get; set; }
        public string? BrochureUrl { get; set; }
        public int? PropertyAge { get; set; }
        public bool HasPowerBackup { get; set; }
        public bool HasWaterSupply { get; set; }
        public bool IsGatedCommunity { get; set; }
        public int ViewCount { get; set; }
        public int BuilderId { get; set; }
        public BuilderMaster BuilderMaster { get; set; }
        public ICollection<ProjectDataPath> ProjectDataPaths { get; set; }
        public ICollection<ProjectMilestone> ProjectMilestones { get; set; }
        public ICollection<ConstructionStageProgress> ConstructionStageProgress { get; set; }
        public ICollection<ProjectUnitType> ProjectUnitTypes { get; set; }
        public ICollection<ProjectAmenity> ProjectAmenities { get; set; }
    }
}
