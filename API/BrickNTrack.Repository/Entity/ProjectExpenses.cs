namespace BrickNTrack.Repository.Entity
{
    public class ProjectExpenses : CommonEntity
    {
        public int ExpenseId { get; set; }
        public string Details { get; set; }
        public double Amount { get; set; }
        public string VendorSupplier {  get; set; }
        public string Category { get; set; }
        public int ProjectMilestoneId { get; set; }

        public ProjectMilestone ProjectMilestone { get; set; }
    }
}
