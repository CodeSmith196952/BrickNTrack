namespace BrickNTrack.Repository.Entity
{
    public class StagePhoto : CommonEntity
    {
        public int Id { get; set; }
        public int StageProgressId { get; set; }
        public string PhotoPath { get; set; }
        public string? Caption { get; set; }

        public ConstructionStageProgress StageProgress { get; set; }
    }
}
