namespace BrickNTrack.Domain.Model
{
    public class ReviewResponse
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public string ProjectName { get; set; }
        public int BuyerUserId { get; set; }
        public string BuyerUserName { get; set; }
        public int OverallRating { get; set; }
        public int? QualityRating { get; set; }
        public int? ValueRating { get; set; }
        public int? LocationRating { get; set; }
        public string? ReviewText { get; set; }
        public string? BuilderResponse { get; set; }
        public DateTime? BuilderResponseDate { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
