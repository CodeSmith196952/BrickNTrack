namespace BrickNTrack.Domain.Model
{
    public class PropertyBookingResponse
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public string ProjectName { get; set; }
        public int BuyerUserId { get; set; }
        public string BuyerUserName { get; set; }
        public double BookingAmount { get; set; }
        public string PaymentStatus { get; set; }
        public string? PaymentMode { get; set; }
        public string? TransactionId { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
