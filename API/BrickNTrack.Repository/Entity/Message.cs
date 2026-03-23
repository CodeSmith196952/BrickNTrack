namespace BrickNTrack.Repository.Entity
{
    public class Message : CommonEntity
    {
        public int Id { get; set; }
        public int ConversationId { get; set; }
        public int SenderUserId { get; set; }
        public string Content { get; set; }
        public string MessageType { get; set; } = "Text";
        public bool IsRead { get; set; }
        public bool IsFlagged { get; set; }

        public Conversation Conversation { get; set; }
        public UserManager SenderUser { get; set; }
    }
}
