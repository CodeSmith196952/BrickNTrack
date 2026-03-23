using BrickNTrack.Domain.CommonModel;
using System.ComponentModel.DataAnnotations;

namespace BrickNTrack.Domain.Model
{
    public class BuilderMasterRequest : CommonModelEntity
    {
        public int BuilderId { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; }

        [StringLength(500)]
        public string TagLine { get; set; }

        [StringLength(2000)]
        public string Description { get; set; }

        [StringLength(500)]
        public string OfficeAddress { get; set; }

        public string LangLog { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string EmailAddress { get; set; }

        [Required]
        [StringLength(20)]
        public string Contact1 { get; set; }

        [StringLength(20)]
        public string Contact2 { get; set; }

        [StringLength(20)]
        public string GSTNo { get; set; }

        [Required]
        [StringLength(100)]
        public string OwnerName { get; set; }

        public string? LogoUrl { get; set; }
        public string? WebsiteUrl { get; set; }
        public int? YearEstablished { get; set; }
        public string? OperatingCities { get; set; }
    }
}
