namespace BrickNTrack.Repository.Entity
{
    public class ConstructionStageProgress : CommonEntity
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public string StageName { get; set; }
        public int StageOrder { get; set; }
        public int CompletionPercentage { get; set; }
        public DateTime? PlannedStartDate { get; set; }
        public DateTime? PlannedEndDate { get; set; }
        public DateTime? ActualStartDate { get; set; }
        public DateTime? ActualEndDate { get; set; }
        public string? Notes { get; set; }
        public string Status { get; set; } = "Pending";

        public ProjectMaster ProjectMaster { get; set; }
        public ICollection<StagePhoto> StagePhotos { get; set; }
    }
}
