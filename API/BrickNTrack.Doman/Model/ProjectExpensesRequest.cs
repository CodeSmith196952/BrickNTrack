namespace BrickNTrack.Doman.Model
{
    public class ProjectExpensesRequest
    {
        public int ExpenseId { get; set; }
        public string Details { get; set; }
        public double Amount { get; set; }
        public string VendorSupplier { get; set; }
        public string Category { get; set; }
        public int ProjectMilestoneId { get; set; }
    }
}
