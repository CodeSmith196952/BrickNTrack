namespace BrickNTrack.Domain.Model
{
    public class NotificationResponse
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Title { get; set; }
        public string Body { get; set; }
        public string Type { get; set; }
        public string? Category { get; set; }
        public bool IsRead { get; set; }
        public string? ActionUrl { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
