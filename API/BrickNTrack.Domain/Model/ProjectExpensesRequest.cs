using BrickNTrack.Domain.CommonModel;
using System.ComponentModel.DataAnnotations;

namespace BrickNTrack.Domain.Model
{
    public class ProjectExpensesRequest : CommonModelEntity
    {
        public int ExpenseId { get; set; }

        [Required]
        [StringLength(500)]
        public string Details { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public double Amount { get; set; }

        [Required]
        [StringLength(200)]
        public string VendorSupplier { get; set; }

        [Required]
        [StringLength(100)]
        public string Category { get; set; }

        public string? PaymentStatus { get; set; }
        public string? PaymentMode { get; set; }
        public string? InvoicePath { get; set; }
        public string? Notes { get; set; }
        public DateTime? PaymentDate { get; set; }
        public double? TotalCost { get; set; }

        public int ProjectMilestoneId { get; set; }
    }
}
