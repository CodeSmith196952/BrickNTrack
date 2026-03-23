using System.ComponentModel.DataAnnotations;

namespace BrickNTrack.Domain.Model
{
    public class ConstructionStageProgressRequest
    {
        public int Id { get; set; }

        [Required]
        public int ProjectId { get; set; }

        [Required, StringLength(200)]
        public string StageName { get; set; }

        [Range(0, 100)]
        public int StageOrder { get; set; }

        [Range(0, 100)]
        public int CompletionPercentage { get; set; }

        public DateTime? PlannedStartDate { get; set; }
        public DateTime? PlannedEndDate { get; set; }
        public DateTime? ActualStartDate { get; set; }
        public DateTime? ActualEndDate { get; set; }

        [StringLength(2000)]
        public string? Notes { get; set; }

        [StringLength(50)]
        public string Status { get; set; } = "Pending";
    }
}
