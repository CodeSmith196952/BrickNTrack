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
    public class AnnouncementController : ControllerBase
    {
        private readonly BrickNTrackContext _context;

        public AnnouncementController(BrickNTrackContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<ServiceResult<List<AnnouncementResponse>>>> GetAnnouncements()
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            var announcements = await _context.Announcements
                .Include(a => a.CreatedByUser)
                .Where(a => a.IsActive && (a.TargetRole == null || a.TargetRole == userRole) && (a.ExpiresAt == null || a.ExpiresAt > DateTime.Now))
                .OrderByDescending(a => a.CreatedDate)
                .Select(a => new AnnouncementResponse
                {
                    Id = a.Id,
                    Title = a.Title,
                    Content = a.Content,
                    Category = a.Category,
                    TargetRole = a.TargetRole,
                    ExpiresAt = a.ExpiresAt,
                    CreatedByUserId = a.CreatedByUserId,
                    CreatedByUserName = a.CreatedByUser.FirstName + " " + a.CreatedByUser.LastName,
                    CreatedDate = a.CreatedDate
                })
                .ToListAsync();

            return Ok(ServiceResult<List<AnnouncementResponse>>.Ok(announcements));
        }

        [HttpPost]
        [Authorize(Roles = Roles.Admin)]
        public async Task<ActionResult<ServiceResult>> Create([FromBody] AnnouncementRequest request)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var userName = User.FindFirst(ClaimTypes.Name)?.Value!;

            var announcement = new Announcement
            {
                Title = request.Title,
                Content = request.Content,
                Category = request.Category,
                TargetRole = request.TargetRole,
                ExpiresAt = request.ExpiresAt,
                CreatedByUserId = userId,
                CreatedBy = userName,
                CreatedDate = DateTime.Now,
                IsActive = true
            };

            _context.Announcements.Add(announcement);
            await _context.SaveChangesAsync();
            return Ok(ServiceResult.Created("Announcement created"));
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<ActionResult<ServiceResult>> Delete(int id)
        {
            var announcement = await _context.Announcements.FindAsync(id);
            if (announcement == null)
                return NotFound(ServiceResult.NotFound("Announcement not found"));

            announcement.IsActive = false;
            announcement.ModifiedDate = DateTime.Now;
            await _context.SaveChangesAsync();
            return Ok(ServiceResult.Ok("Announcement deleted"));
        }
    }
}
