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
    public class NotificationController : ControllerBase
    {
        private readonly BrickNTrackContext _context;

        public NotificationController(BrickNTrackContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<ServiceResult<List<NotificationResponse>>>> GetNotifications([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

            var notifications = await _context.Notifications
                .Where(n => n.UserId == userId && n.IsActive)
                .OrderByDescending(n => n.CreatedDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(n => new NotificationResponse
                {
                    Id = n.Id,
                    UserId = n.UserId,
                    Title = n.Title,
                    Body = n.Body,
                    Type = n.Type,
                    Category = n.Category,
                    IsRead = n.IsRead,
                    ActionUrl = n.ActionUrl,
                    CreatedDate = n.CreatedDate
                })
                .ToListAsync();

            return Ok(ServiceResult<List<NotificationResponse>>.Ok(notifications));
        }

        [HttpGet("unread-count")]
        public async Task<ActionResult<ServiceResult<int>>> GetUnreadCount()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var count = await _context.Notifications.CountAsync(n => n.UserId == userId && !n.IsRead && n.IsActive);
            return Ok(ServiceResult<int>.Ok(count));
        }

        [HttpPut("{id}/read")]
        public async Task<ActionResult<ServiceResult>> MarkAsRead(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var notification = await _context.Notifications.FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);
            if (notification == null)
                return NotFound(ServiceResult.NotFound("Notification not found"));

            notification.IsRead = true;
            await _context.SaveChangesAsync();
            return Ok(ServiceResult.Ok("Notification marked as read"));
        }

        [HttpPut("read-all")]
        public async Task<ActionResult<ServiceResult>> MarkAllAsRead()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var unread = await _context.Notifications.Where(n => n.UserId == userId && !n.IsRead).ToListAsync();
            unread.ForEach(n => n.IsRead = true);
            await _context.SaveChangesAsync();
            return Ok(ServiceResult.Ok($"Marked {unread.Count} notifications as read"));
        }

        [HttpGet("settings")]
        public async Task<ActionResult<ServiceResult<NotificationSettingResponse>>> GetSettings()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var settings = await _context.NotificationSettings.FirstOrDefaultAsync(s => s.UserId == userId);

            if (settings == null)
            {
                settings = new NotificationSetting { UserId = userId, EmailEnabled = true, InAppEnabled = true, CreatedBy = "system", CreatedDate = DateTime.Now, IsActive = true };
                _context.NotificationSettings.Add(settings);
                await _context.SaveChangesAsync();
            }

            var response = new NotificationSettingResponse
            {
                Id = settings.Id,
                UserId = settings.UserId,
                EmailEnabled = settings.EmailEnabled,
                SmsEnabled = settings.SmsEnabled,
                PushEnabled = settings.PushEnabled,
                InAppEnabled = settings.InAppEnabled
            };

            return Ok(ServiceResult<NotificationSettingResponse>.Ok(response));
        }

        [HttpPut("settings")]
        public async Task<ActionResult<ServiceResult>> UpdateSettings([FromBody] NotificationSettingRequest request)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var settings = await _context.NotificationSettings.FirstOrDefaultAsync(s => s.UserId == userId);

            if (settings == null)
            {
                settings = new NotificationSetting { UserId = userId, CreatedBy = "system", CreatedDate = DateTime.Now, IsActive = true };
                _context.NotificationSettings.Add(settings);
            }

            settings.EmailEnabled = request.EmailEnabled;
            settings.SmsEnabled = request.SmsEnabled;
            settings.PushEnabled = request.PushEnabled;
            settings.InAppEnabled = request.InAppEnabled;
            settings.ModifiedDate = DateTime.Now;

            await _context.SaveChangesAsync();
            return Ok(ServiceResult.Ok("Settings updated"));
        }
    }
}
