namespace BrickNTrack.Domain.Model
{
    public class ConversationResponse
    {
        public int Id { get; set; }
        public int BuyerUserId { get; set; }
        public string BuyerUserName { get; set; }
        public int SellerUserId { get; set; }
        public string SellerUserName { get; set; }
        public int? ProjectId { get; set; }
        public string? ProjectName { get; set; }
        public DateTime LastMessageAt { get; set; }
        public string? LastMessageContent { get; set; }
        public int UnreadCount { get; set; }
    }
}
