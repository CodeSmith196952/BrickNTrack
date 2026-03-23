namespace BrickNTrack.Domain.Model
{
    public class BuilderDashboardResponse
    {
        public int TotalProjects { get; set; }
        public int ActiveProjects { get; set; }
        public int ActiveMilestones { get; set; }
        public double TotalBudget { get; set; }
        public double TotalSpent { get; set; }
        public int TotalBookings { get; set; }
        public int PendingBookings { get; set; }
        public double AverageRating { get; set; }
    }

    public class BuyerDashboardResponse
    {
        public int TotalBookings { get; set; }
        public int ActiveBookings { get; set; }
        public int SavedProperties { get; set; }
        public int UnreadMessages { get; set; }
        public int ReviewsGiven { get; set; }
    }

    public class AdminDashboardResponse
    {
        public int TotalUsers { get; set; }
        public int TotalBuilders { get; set; }
        public int TotalBuyers { get; set; }
        public int TotalProjects { get; set; }
        public int ActiveProjects { get; set; }
        public int PendingReports { get; set; }
        public int FlaggedMessages { get; set; }
        public int TotalBookings { get; set; }
        public double TotalRevenue { get; set; }
    }

    public class CostMonitoringResponse
    {
        public int ProjectId { get; set; }
        public string ProjectName { get; set; }
        public double TotalBudget { get; set; }
        public double TotalSpent { get; set; }
        public double Remaining { get; set; }
        public double UtilizationPercentage { get; set; }
        public List<StageWiseCost> StageWiseCosts { get; set; } = new();
        public List<ProjectExpensesResponse> RecentExpenses { get; set; } = new();
    }

    public class StageWiseCost
    {
        public int MilestoneId { get; set; }
        public string StageName { get; set; }
        public double Budget { get; set; }
        public double Spent { get; set; }
    }
}
