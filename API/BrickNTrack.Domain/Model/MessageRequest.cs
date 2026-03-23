using System.ComponentModel.DataAnnotations;

namespace BrickNTrack.Domain.Model
{
    public class MessageRequest
    {
        [Required]
        public int ConversationId { get; set; }

        [Required, StringLength(5000)]
        public string Content { get; set; }

        [StringLength(50)]
        public string MessageType { get; set; } = "Text";
    }
}
