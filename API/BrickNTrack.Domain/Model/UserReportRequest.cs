using System.ComponentModel.DataAnnotations;

namespace BrickNTrack.Domain.Model
{
    public class UserReportRequest
    {
        public int? ReportedMessageId { get; set; }
        public int? ReportedReviewId { get; set; }

        [Required, StringLength(2000)]
        public string Reason { get; set; }
    }
}
