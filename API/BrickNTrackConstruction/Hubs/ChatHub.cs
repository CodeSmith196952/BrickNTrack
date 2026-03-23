using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace BrickNTrackConstruction.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        public async Task SendMessage(int conversationId, string content, string messageType = "Text")
        {
            var senderUserId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var senderName = Context.User?.FindFirst(ClaimTypes.Name)?.Value;

            await Clients.Group($"conversation_{conversationId}").SendAsync("ReceiveMessage", new
            {
                ConversationId = conversationId,
                SenderUserId = senderUserId,
                SenderUserName = senderName,
                Content = content,
                MessageType = messageType,
                SentAt = DateTime.UtcNow
            });
        }

        public async Task JoinConversation(int conversationId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"conversation_{conversationId}");
        }

        public async Task LeaveConversation(int conversationId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"conversation_{conversationId}");
        }

        public async Task TypingIndicator(int conversationId, bool isTyping)
        {
            var senderUserId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var senderName = Context.User?.FindFirst(ClaimTypes.Name)?.Value;

            await Clients.OthersInGroup($"conversation_{conversationId}").SendAsync("UserTyping", new
            {
                ConversationId = conversationId,
                UserId = senderUserId,
                UserName = senderName,
                IsTyping = isTyping
            });
        }

        public async Task MessageRead(int conversationId, int messageId)
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            await Clients.OthersInGroup($"conversation_{conversationId}").SendAsync("MessageRead", new
            {
                ConversationId = conversationId,
                MessageId = messageId,
                ReadByUserId = userId,
                ReadAt = DateTime.UtcNow
            });
        }

        public override async Task OnConnectedAsync()
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId != null)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
            }
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId != null)
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user_{userId}");
            }
            await base.OnDisconnectedAsync(exception);
        }
    }
}
