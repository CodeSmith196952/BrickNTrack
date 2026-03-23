namespace BrickNTrack.Domain.Model
{
    public class ProjectExpensesResponse
    {
        public int ExpenseId { get; set; }
        public string Details { get; set; }
        public double Amount { get; set; }
        public string VendorSupplier { get; set; }
        public string Category { get; set; }
        public string? PaymentStatus { get; set; }
        public string? PaymentMode { get; set; }
        public string? InvoicePath { get; set; }
        public string? Notes { get; set; }
        public DateTime? PaymentDate { get; set; }
        public double? TotalCost { get; set; }
        public int ProjectMilestoneId { get; set; }
        public string MilestoneName { get; set; }
        public List<ProjectMilestoneResponse> ProjectExpenses { get; set; }
    }
}
