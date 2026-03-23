namespace BrickNTrack.Repository.Entity
{
    public class ProjectAmenity
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public int AmenityId { get; set; }
        public ProjectMaster ProjectMaster { get; set; }
        public AmenityMaster AmenityMaster { get; set; }
    }
}
