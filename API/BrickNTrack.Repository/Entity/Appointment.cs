namespace BrickNTrack.Repository.Entity
{
    public class Appointment : CommonEntity
    {
        public int Id { get; set; }
        public int BuyerUserId { get; set; }
        public int SellerUserId { get; set; }
        public int ProjectId { get; set; }
        public DateTime ScheduledDate { get; set; }
        public string? TimeSlot { get; set; }
        public string Status { get; set; } = "Pending";
        public string? Notes { get; set; }
        public string? CancellationReason { get; set; }

        public UserManager BuyerUser { get; set; }
        public UserManager SellerUser { get; set; }
        public ProjectMaster ProjectMaster { get; set; }
    }
}
