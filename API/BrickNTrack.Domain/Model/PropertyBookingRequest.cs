using System.ComponentModel.DataAnnotations;

namespace BrickNTrack.Domain.Model
{
    public class PropertyBookingRequest
    {
        [Required]
        public int ProjectId { get; set; }

        [Required, Range(0, double.MaxValue)]
        public double BookingAmount { get; set; }

        [StringLength(50)]
        public string? PaymentMode { get; set; }

        [StringLength(200)]
        public string? TransactionId { get; set; }

        [StringLength(2000)]
        public string? Notes { get; set; }
    }
}
