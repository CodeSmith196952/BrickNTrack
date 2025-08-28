using BrickNTrack.Doman.CommonModel;

namespace BrickNTrack.Doman.Model
{
    public class ProjectMilestoneRequest : CommonModelEntity
    {
        public int MilestoneId { get; set; }
        public int ProjectId { get; set; }
        public string MilestoneName { get; set; }
        public string MilestoneDetails { get; set; }
        public double Budget { get; set; }
        public string? BudgetStatus { get; set; }
        public string Status { get; set; }
        public DateTime? PlannedStartDate { get; set; }
        public DateTime? PlannedTargetDate { get; set; }
        public int PlannedDuration { get; set; }
    }
}
