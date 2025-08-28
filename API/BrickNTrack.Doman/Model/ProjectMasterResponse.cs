namespace BrickNTrack.Doman.Model
{
    public class ProjectMasterResponse
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
        public string Latlong { get; set; }
        public string ProfileImage { get; set; }
        public string ReraNumber { get; set; }
        public double Budget { get; set; }
        public string Status { get; set; }
        public int BuilderId { get; set; }
        public string BuilderName { get; set; }
        public double TotalSpend { get; set; }
        public BuilderMasterResponse BuilderMaster { get; set; }
        public List<ProjectDataPathResponse> ProjectDataPath { get; set; }
        public List<ProjectMilestoneResponse> ProjectMilestone{ get; set; }
    }
}
