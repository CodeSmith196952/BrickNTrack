using BrickNTrack.Domain.CommonModel;
using BrickNTrack.Domain.Model;
using BrickNTrack.Repository.Context;
using BrickNTrack.Repository.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BrickNTrackConstruction.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MessagingController : ControllerBase
    {
        private readonly BrickNTrackContext _context;

        public MessagingController(BrickNTrackContext context)
        {
            _context = context;
        }

        [HttpGet("conversations")]
        public async Task<ActionResult<ServiceResult<List<ConversationResponse>>>> GetConversations()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

            var conversations = await _context.Conversations
                .Include(c => c.BuyerUser)
                .Include(c => c.SellerUser)
                .Include(c => c.ProjectMaster)
                .Include(c => c.Messages)
                .Where(c => c.BuyerUserId == userId || c.SellerUserId == userId)
                .OrderByDescending(c => c.LastMessageAt)
                .Select(c => new ConversationResponse
                {
                    Id = c.Id,
                    BuyerUserId = c.BuyerUserId,
                    BuyerUserName = c.BuyerUser.FirstName + " " + c.BuyerUser.LastName,
                    SellerUserId = c.SellerUserId,
                    SellerUserName = c.SellerUser.FirstName + " " + c.SellerUser.LastName,
                    ProjectId = c.ProjectId,
                    ProjectName = c.ProjectMaster != null ? c.ProjectMaster.ProjectName : null,
                    LastMessageAt = c.LastMessageAt,
                    LastMessageContent = c.Messages.OrderByDescending(m => m.CreatedDate).Select(m => m.Content).FirstOrDefault(),
                    UnreadCount = c.Messages.Count(m => !m.IsRead && m.SenderUserId != userId)
                })
                .ToListAsync();

            return Ok(ServiceResult<List<ConversationResponse>>.Ok(conversations));
        }

        [HttpPost("conversations")]
        public async Task<ActionResult<ServiceResult<ConversationResponse>>> CreateConversation([FromBody] ConversationRequest request)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var userName = User.FindFirst(ClaimTypes.Name)?.Value!;

            // Resolve builderId to recipientUserId if needed
            if (request.RecipientUserId == 0 && request.BuilderId.HasValue && request.BuilderId > 0)
            {
                var builderUser = await _context.UserManager
                    .FirstOrDefaultAsync(u => u.BuilderId == request.BuilderId);
                if (builderUser == null)
                    return NotFound(ServiceResult<ConversationResponse>.NotFound("Builder user not found"));
                request.RecipientUserId = builderUser.Id;
            }

            if (request.RecipientUserId == 0)
                return BadRequest(ServiceResult<ConversationResponse>.Fail("Recipient is required"));

            var existing = await _context.Conversations.FirstOrDefaultAsync(c =>
                (c.BuyerUserId == userId && c.SellerUserId == request.RecipientUserId) ||
                (c.BuyerUserId == request.RecipientUserId && c.SellerUserId == userId));

            if (existing != null)
            {
                var resp = new ConversationResponse { Id = existing.Id };
                return Ok(ServiceResult<ConversationResponse>.Ok(resp, "Conversation already exists"));
            }

            var conversation = new Conversation
            {
                BuyerUserId = userId,
                SellerUserId = request.RecipientUserId,
                ProjectId = request.ProjectId,
                LastMessageAt = DateTime.Now,
                CreatedBy = userName,
                CreatedDate = DateTime.Now,
                IsActive = true
            };

            _context.Conversations.Add(conversation);
            await _context.SaveChangesAsync();

            return Ok(ServiceResult<ConversationResponse>.Created(
                new ConversationResponse { Id = conversation.Id }, "Conversation created"));
        }

        [HttpGet("conversations/{conversationId}/messages")]
        public async Task<ActionResult<ServiceResult<List<MessageResponse>>>> GetMessages(int conversationId, [FromQuery] int page = 1, [FromQuery] int pageSize = 50)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

            var conversation = await _context.Conversations.FindAsync(conversationId);
            if (conversation == null || (conversation.BuyerUserId != userId && conversation.SellerUserId != userId))
                return NotFound(ServiceResult<List<MessageResponse>>.NotFound("Conversation not found"));

            var messages = await _context.Messages
                .Include(m => m.SenderUser)
                .Where(m => m.ConversationId == conversationId)
                .OrderByDescending(m => m.CreatedDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(m => new MessageResponse
                {
                    Id = m.Id,
                    ConversationId = m.ConversationId,
                    SenderUserId = m.SenderUserId,
                    SenderUserName = m.SenderUser.FirstName + " " + m.SenderUser.LastName,
                    Content = m.Content,
                    MessageType = m.MessageType,
                    IsRead = m.IsRead,
                    IsFlagged = m.IsFlagged,
                    CreatedDate = m.CreatedDate
                })
                .ToListAsync();

            return Ok(ServiceResult<List<MessageResponse>>.Ok(messages));
        }

        [HttpPost("messages")]
        public async Task<ActionResult<ServiceResult<MessageResponse>>> SendMessage([FromBody] MessageRequest request)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var userName = User.FindFirst(ClaimTypes.Name)?.Value!;

            var conversation = await _context.Conversations.FindAsync(request.ConversationId);
            if (conversation == null || (conversation.BuyerUserId != userId && conversation.SellerUserId != userId))
                return NotFound(ServiceResult<MessageResponse>.NotFound("Conversation not found"));

            var message = new Message
            {
                ConversationId = request.ConversationId,
                SenderUserId = userId,
                Content = request.Content,
                MessageType = request.MessageType,
                CreatedBy = userName,
                CreatedDate = DateTime.Now,
                IsActive = true
            };

            _context.Messages.Add(message);
            conversation.LastMessageAt = DateTime.Now;
            await _context.SaveChangesAsync();

            var response = new MessageResponse
            {
                Id = message.Id,
                ConversationId = message.ConversationId,
                SenderUserId = message.SenderUserId,
                SenderUserName = userName,
                Content = message.Content,
                MessageType = message.MessageType,
                CreatedDate = message.CreatedDate
            };

            return Ok(ServiceResult<MessageResponse>.Created(response, "Message sent"));
        }

        [HttpPut("messages/{conversationId}/read")]
        public async Task<ActionResult<ServiceResult>> MarkAsRead(int conversationId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

            // Verify user is part of the conversation
            var conversation = await _context.Conversations.FindAsync(conversationId);
            if (conversation == null || (conversation.BuyerUserId != userId && conversation.SellerUserId != userId))
                return NotFound(ServiceResult.NotFound("Conversation not found"));

            var unread = await _context.Messages
                .Where(m => m.ConversationId == conversationId && m.SenderUserId != userId && !m.IsRead)
                .ToListAsync();

            unread.ForEach(m => m.IsRead = true);
            await _context.SaveChangesAsync();

            return Ok(ServiceResult.Ok($"Marked {unread.Count} messages as read"));
        }
    }
}
