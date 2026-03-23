namespace BrickNTrack.Repository.Entity
{
    public class PropertyBooking : CommonEntity
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public int BuyerUserId { get; set; }
        public double BookingAmount { get; set; }
        public string PaymentStatus { get; set; } = "Pending";
        public string? PaymentMode { get; set; }
        public string? TransactionId { get; set; }
        public string? Notes { get; set; }

        public ProjectMaster ProjectMaster { get; set; }
        public UserManager BuyerUser { get; set; }
    }
}
