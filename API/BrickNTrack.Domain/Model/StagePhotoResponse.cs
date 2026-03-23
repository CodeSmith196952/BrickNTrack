namespace BrickNTrack.Domain.Model
{
    public class StagePhotoResponse
    {
        public int Id { get; set; }
        public int StageProgressId { get; set; }
        public string PhotoPath { get; set; }
        public string? Caption { get; set; }
    }
}
