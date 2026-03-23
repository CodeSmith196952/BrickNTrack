namespace BrickNTrack.Domain.Model
{
    public class UserReportResponse
    {
        public int Id { get; set; }
        public int ReporterUserId { get; set; }
        public string ReporterUserName { get; set; }
        public int? ReportedMessageId { get; set; }
        public int? ReportedReviewId { get; set; }
        public string Reason { get; set; }
        public string Status { get; set; }
        public string? AdminNotes { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
