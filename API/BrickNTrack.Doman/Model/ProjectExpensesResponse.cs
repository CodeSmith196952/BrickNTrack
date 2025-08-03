namespace BrickNTrack.Doman.Model
{
    public class ProjectExpensesResponse
    {
        public int ExpenseId { get; set; }
        public string Details { get; set; }
        public double Amount { get; set; }
        public string VendorSupplier { get; set; }
        public string Category { get; set; }
        public int ProjectMilestoneId { get; set; }
        public string MilestoneName { get; set; }
        public List<ProjectExpensesResponse> ProjectExpenses { get; set; }
    }
}
