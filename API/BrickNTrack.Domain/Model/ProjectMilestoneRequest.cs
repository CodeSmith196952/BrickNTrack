using BrickNTrack.Domain.CommonModel;
using System.ComponentModel.DataAnnotations;

namespace BrickNTrack.Domain.Model
{
    public class ProjectMilestoneRequest : CommonModelEntity
    {
        public int MilestoneId { get; set; }
        public int ProjectId { get; set; }

        [Required]
        [StringLength(200)]
        public string MilestoneName { get; set; }

        [StringLength(2000)]
        public string MilestoneDetails { get; set; }

        [Range(0, double.MaxValue)]
        public double Budget { get; set; }

        public string? BudgetStatus { get; set; }

        [Required]
        [StringLength(50)]
        public string Status { get; set; }

        public DateTime? PlannedStartDate { get; set; }
        public DateTime? PlannedTargetDate { get; set; }
        public int PlannedDuration { get; set; }

        [Range(0, 100)]
        public int MilestoneCompletionPer { get; set; }
    }
}
