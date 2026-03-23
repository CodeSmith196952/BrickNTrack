using System.ComponentModel.DataAnnotations;

namespace BrickNTrack.Domain.Model
{
    public class AnnouncementRequest
    {
        [Required, StringLength(200)]
        public string Title { get; set; }

        [Required, StringLength(5000)]
        public string Content { get; set; }

        [StringLength(50)]
        public string? Category { get; set; }

        [StringLength(20)]
        public string? TargetRole { get; set; }

        public DateTime? ExpiresAt { get; set; }
    }
}
