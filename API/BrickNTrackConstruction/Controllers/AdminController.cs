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
    [Authorize(Roles = Roles.Admin)]
    public class AdminController : ControllerBase
    {
        private readonly BrickNTrackContext _context;

        public AdminController(BrickNTrackContext context)
        {
            _context = context;
        }

        [HttpGet("reports")]
        public async Task<ActionResult<ServiceResult<List<UserReportResponse>>>> GetReports([FromQuery] string? status)
        {
            var query = _context.UserReports.Include(r => r.ReporterUser).AsQueryable();
            if (!string.IsNullOrWhiteSpace(status))
                query = query.Where(r => r.Status == status);

            var reports = await query
                .OrderByDescending(r => r.CreatedDate)
                .Select(r => new UserReportResponse
                {
                    Id = r.Id,
                    ReporterUserId = r.ReporterUserId,
                    ReporterUserName = r.ReporterUser.FirstName + " " + r.ReporterUser.LastName,
                    ReportedMessageId = r.ReportedMessageId,
                    ReportedReviewId = r.ReportedReviewId,
                    Reason = r.Reason,
                    Status = r.Status,
                    AdminNotes = r.AdminNotes,
                    CreatedDate = r.CreatedDate
                })
                .ToListAsync();

            return Ok(ServiceResult<List<UserReportResponse>>.Ok(reports));
        }

        [HttpPut("reports/{id}")]
        public async Task<ActionResult<ServiceResult>> UpdateReportStatus(int id, [FromQuery] string status, [FromQuery] string? adminNotes)
        {
            var report = await _context.UserReports.FindAsync(id);
            if (report == null)
                return NotFound(ServiceResult.NotFound("Report not found"));

            report.Status = status;
            report.AdminNotes = adminNotes;
            report.ModifiedBy = User.FindFirst(ClaimTypes.Name)?.Value;
            report.ModifiedDate = DateTime.Now;
            await _context.SaveChangesAsync();
            return Ok(ServiceResult.Ok("Report updated"));
        }

        [HttpGet("flagged-messages")]
        public async Task<ActionResult<ServiceResult<List<MessageResponse>>>> GetFlaggedMessages()
        {
            var messages = await _context.Messages
                .Include(m => m.SenderUser)
                .Where(m => m.IsFlagged)
                .OrderByDescending(m => m.CreatedDate)
                .Select(m => new MessageResponse
                {
                    Id = m.Id,
                    ConversationId = m.ConversationId,
                    SenderUserId = m.SenderUserId,
                    SenderUserName = m.SenderUser.FirstName + " " + m.SenderUser.LastName,
                    Content = m.Content,
                    MessageType = m.MessageType,
                    IsFlagged = m.IsFlagged,
                    CreatedDate = m.CreatedDate
                })
                .ToListAsync();

            return Ok(ServiceResult<List<MessageResponse>>.Ok(messages));
        }

        [HttpPut("users/{userId}/role")]
        public async Task<ActionResult<ServiceResult>> UpdateUserRole(int userId, [FromQuery] string role)
        {
            if (role != Roles.Admin && role != Roles.Builder && role != Roles.Buyer)
                return BadRequest(ServiceResult.Fail("Invalid role"));

            var user = await _context.UserManager.FindAsync(userId);
            if (user == null)
                return NotFound(ServiceResult.NotFound("User not found"));

            user.Role = role;
            user.ModifiedDate = DateTime.Now;
            user.ModifiedBy = User.FindFirst(ClaimTypes.Name)?.Value;
            await _context.SaveChangesAsync();
            return Ok(ServiceResult.Ok($"User role updated to {role}"));
        }

        [HttpGet("analytics")]
        public async Task<ActionResult<ServiceResult<AdminDashboardResponse>>> GetAnalytics()
        {
            var response = new AdminDashboardResponse
            {
                TotalUsers = await _context.UserManager.CountAsync(),
                TotalBuilders = await _context.UserManager.CountAsync(u => u.Role == "Builder"),
                TotalBuyers = await _context.UserManager.CountAsync(u => u.Role == "Buyer"),
                TotalProjects = await _context.ProjectMasters.CountAsync(),
                ActiveProjects = await _context.ProjectMasters.CountAsync(p => p.IsActive),
                PendingReports = await _context.UserReports.CountAsync(r => r.Status == "Pending"),
                FlaggedMessages = await _context.Messages.CountAsync(m => m.IsFlagged),
                TotalBookings = await _context.PropertyBookings.CountAsync(),
                TotalRevenue = await _context.PropertyBookings.Where(b => b.PaymentStatus == "Confirmed").SumAsync(b => b.BookingAmount)
            };

            return Ok(ServiceResult<AdminDashboardResponse>.Ok(response));
        }
    }
}
