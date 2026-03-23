using System.ComponentModel.DataAnnotations;

namespace BrickNTrack.Domain.Model
{
    public class ConversationRequest
    {
        public int RecipientUserId { get; set; }
        public int? BuilderId { get; set; }
        public int? ProjectId { get; set; }
    }
}
