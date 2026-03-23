namespace BrickNTrack.Domain.Model
{
    public class MessageResponse
    {
        public int Id { get; set; }
        public int ConversationId { get; set; }
        public int SenderUserId { get; set; }
        public string SenderUserName { get; set; }
        public string Content { get; set; }
        public string MessageType { get; set; }
        public bool IsRead { get; set; }
        public bool IsFlagged { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
