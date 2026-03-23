using BrickNTrack.Domain.CommonModel;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BrickNTrack.Domain.Model
{
    public class ProjectMasterRequest : CommonModelEntity
    {
        public int ProjectId { get; set; }

        [Required]
        [StringLength(200)]
        public string ProjectName { get; set; }

        [StringLength(2000)]
        public string? ProjectDescription { get; set; }

        [Range(0, 100)]
        public int CompletionPercentage { get; set; }

        public DateTime? StartDate { get; set; }
        public DateTime? CompletionDate { get; set; }

        [StringLength(500)]
        public string? ProjectAddress { get; set; }

        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string? Locality { get; set; }
        public string? ProfileImage { get; set; }

        [StringLength(50)]
        public string? ReraNumber { get; set; }

        [Range(0, double.MaxValue)]
        public double Budget { get; set; }

        [StringLength(50)]
        public string? Status { get; set; }

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

        public int BuilderId { get; set; }
        public IFormFile? ProfileImageFile { get; set; }
    }
}
