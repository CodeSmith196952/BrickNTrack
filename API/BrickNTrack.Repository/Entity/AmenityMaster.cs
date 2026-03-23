namespace BrickNTrack.Repository.Entity
{
    public class AmenityMaster : CommonEntity
    {
        public int AmenityId { get; set; }
        public string Name { get; set; } = "";
        public string Icon { get; set; } = "";         // Font Awesome class e.g. "fa-solid fa-water"
        public string Category { get; set; } = "";      // Recreation, Security, Convenience, Utilities, Sports
        public ICollection<ProjectAmenity> ProjectAmenities { get; set; } = new List<ProjectAmenity>();
    }
}
