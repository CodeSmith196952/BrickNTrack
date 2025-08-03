namespace BrickNTrack.Doman.Model
{
    public class ProjectMilestoneRequest
    {
        public int MilestoneId { get; set; }
        public int ProjectId { get; set; }
        public string MilestoneName { get; set; }
        public string MilestoneDetails { get; set; }
        public double Budget { get; set; }
        public string BudgetStatus { get; set; }
        public string Status { get; set; }
        public DateTime? PlannedStartDate { get; set; }
        public DateTime? PlannedTargetDate { get; set; }
        public int PlannedDuration { get; set; }
        public DateTime? ActualStartDate { get; set; }
        public DateTime? ActualTargetDate { get; set; }
        public DateTime? ActualDuration { get; set; }
    }
}
