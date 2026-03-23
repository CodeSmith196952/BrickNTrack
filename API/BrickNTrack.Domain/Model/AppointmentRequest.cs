using System.ComponentModel.DataAnnotations;

namespace BrickNTrack.Domain.Model
{
    public class AppointmentRequest
    {
        [Required]
        public int SellerUserId { get; set; }

        [Required]
        public int ProjectId { get; set; }

        [Required]
        public DateTime ScheduledDate { get; set; }

        [StringLength(50)]
        public string? TimeSlot { get; set; }

        [StringLength(500)]
        public string? Notes { get; set; }
    }
}
