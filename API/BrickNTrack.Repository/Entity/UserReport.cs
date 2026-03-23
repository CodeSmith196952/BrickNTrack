namespace BrickNTrack.Repository.Entity
{
    public class UserReport : CommonEntity
    {
        public int Id { get; set; }
        public int ReporterUserId { get; set; }
        public int? ReportedMessageId { get; set; }
        public int? ReportedReviewId { get; set; }
        public string Reason { get; set; }
        public string Status { get; set; } = "Pending";
        public string? AdminNotes { get; set; }

        public UserManager ReporterUser { get; set; }
        public Message? ReportedMessage { get; set; }
        public Review? ReportedReview { get; set; }
    }
}
