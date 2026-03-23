namespace BrickNTrack.Domain.Model
{
    public class AppointmentResponse
    {
        public int Id { get; set; }
        public int BuyerUserId { get; set; }
        public string BuyerUserName { get; set; }
        public int SellerUserId { get; set; }
        public string SellerUserName { get; set; }
        public int ProjectId { get; set; }
        public string ProjectName { get; set; }
        public DateTime ScheduledDate { get; set; }
        public string? TimeSlot { get; set; }
        public string Status { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
