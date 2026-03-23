namespace BrickNTrack.Repository.Entity
{
    public class Review : CommonEntity
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public int BuyerUserId { get; set; }
        public int OverallRating { get; set; }
        public int? QualityRating { get; set; }
        public int? ValueRating { get; set; }
        public int? LocationRating { get; set; }
        public string? ReviewText { get; set; }
        public string? BuilderResponse { get; set; }
        public DateTime? BuilderResponseDate { get; set; }

        public ProjectMaster ProjectMaster { get; set; }
        public UserManager BuyerUser { get; set; }
    }
}
