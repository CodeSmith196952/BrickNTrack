using BrickNTrack.Domain.CommonModel;
using BrickNTrack.Domain.Model;
using BrickNTrack.Repository.Context;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BrickNTrackConstruction.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly BrickNTrackContext _context;

        public DashboardController(BrickNTrackContext context)
        {
            _context = context;
        }

        [HttpGet("builder")]
        [Authorize(Roles = Roles.AdminOrBuilder)]
        public async Task<ActionResult<ServiceResult<BuilderDashboardResponse>>> GetBuilderDashboard()
        {
            var builderIdStr = User.FindFirst("BuilderId")?.Value;
            if (string.IsNullOrEmpty(builderIdStr) || !int.TryParse(builderIdStr, out var bid) || bid == 0)
                return BadRequest(ServiceResult<BuilderDashboardResponse>.Fail("Builder ID not found"));

            var projectIds = await _context.ProjectMasters
                .Where(p => p.BuilderId == bid)
                .Select(p => p.ProjectId)
                .ToListAsync();

            var totalProjects = projectIds.Count;
            var activeProjects = await _context.ProjectMasters
                .CountAsync(p => p.BuilderId == bid && p.IsActive && p.Status != "Completed");

            var activeMilestones = await _context.ProjectMilestones
                .CountAsync(m => projectIds.Contains(m.ProjectId) && m.IsActive);

            var totalBudget = await _context.ProjectMasters
                .Where(p => p.BuilderId == bid)
                .SumAsync(p => p.Budget);

            var totalSpent = await _context.ProjectExpenses
                .Where(e => e.IsActive && e.ProjectMilestone.ProjectMaster.BuilderId == bid)
                .SumAsync(e => e.Amount);

            var totalBookings = await _context.PropertyBookings
                .CountAsync(b => projectIds.Contains(b.ProjectId));

            var pendingBookings = await _context.PropertyBookings
                .CountAsync(b => projectIds.Contains(b.ProjectId) && b.PaymentStatus == "Pending");

            var avgRating = await _context.Reviews
                .Where(r => projectIds.Contains(r.ProjectId) && r.IsActive)
                .Select(r => (double?)r.OverallRating)
                .AverageAsync() ?? 0;

            var response = new BuilderDashboardResponse
            {
                TotalProjects = totalProjects,
                ActiveProjects = activeProjects,
                ActiveMilestones = activeMilestones,
                TotalBudget = totalBudget,
                TotalSpent = totalSpent,
                TotalBookings = totalBookings,
                PendingBookings = pendingBookings,
                AverageRating = Math.Round(avgRating, 1)
            };

            return Ok(ServiceResult<BuilderDashboardResponse>.Ok(response));
        }

        [HttpGet("buyer")]
        [Authorize(Roles = Roles.Buyer)]
        public async Task<ActionResult<ServiceResult<BuyerDashboardResponse>>> GetBuyerDashboard()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

            var totalBookings = await _context.PropertyBookings
                .CountAsync(b => b.BuyerUserId == userId);

            var activeBookings = await _context.PropertyBookings
                .CountAsync(b => b.BuyerUserId == userId &&
                    (b.PaymentStatus == "Pending" || b.PaymentStatus == "Confirmed"));

            var unreadMessages = await _context.Messages
                .CountAsync(m => m.Conversation.BuyerUserId == userId &&
                    !m.IsRead && m.SenderUserId != userId);

            var reviewsGiven = await _context.Reviews
                .CountAsync(r => r.BuyerUserId == userId);

            var savedProperties = await _context.SavedProperties
                .CountAsync(s => s.UserId == userId);

            var response = new BuyerDashboardResponse
            {
                TotalBookings = totalBookings,
                ActiveBookings = activeBookings,
                UnreadMessages = unreadMessages,
                ReviewsGiven = reviewsGiven,
                SavedProperties = savedProperties
            };

            return Ok(ServiceResult<BuyerDashboardResponse>.Ok(response));
        }

        [HttpGet("admin")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<ActionResult<ServiceResult<AdminDashboardResponse>>> GetAdminDashboard()
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
                TotalRevenue = await _context.PropertyBookings
                    .Where(b => b.PaymentStatus == "Confirmed")
                    .SumAsync(b => (double?)b.BookingAmount) ?? 0
            };

            return Ok(ServiceResult<AdminDashboardResponse>.Ok(response));
        }
    }
}
