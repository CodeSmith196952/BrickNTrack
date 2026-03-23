namespace BrickNTrack.Domain.Model
{
    public class AnnouncementResponse
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string? Category { get; set; }
        public string? TargetRole { get; set; }
        public DateTime? ExpiresAt { get; set; }
        public int CreatedByUserId { get; set; }
        public string CreatedByUserName { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
