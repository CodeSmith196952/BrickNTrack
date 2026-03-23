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
    public class AppointmentController : ControllerBase
    {
        private readonly BrickNTrackContext _context;

        public AppointmentController(BrickNTrackContext context)
        {
            _context = context;
        }

        [HttpPost]
        [Authorize(Roles = Roles.Buyer)]
        public async Task<ActionResult<ServiceResult>> Create([FromBody] AppointmentRequest request)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var userName = User.FindFirst(ClaimTypes.Name)?.Value!;

            // Resolve seller user from BuilderId if SellerUserId not provided
            var sellerUserId = request.SellerUserId;
            if (sellerUserId == 0 && request.ProjectId > 0)
            {
                var project = await _context.ProjectMasters.FirstOrDefaultAsync(p => p.ProjectId == request.ProjectId);
                if (project != null)
                {
                    var sellerUser = await _context.UserManager.FirstOrDefaultAsync(u => u.BuilderId == project.BuilderId && u.IsActive);
                    sellerUserId = sellerUser?.Id ?? 0;
                }
            }
            if (sellerUserId == 0)
                return BadRequest(ServiceResult.Fail("Could not find the builder for this property"));

            var appointment = new Appointment
            {
                BuyerUserId = userId,
                SellerUserId = sellerUserId,
                ProjectId = request.ProjectId,
                ScheduledDate = request.ScheduledDate,
                TimeSlot = request.TimeSlot,
                Notes = request.Notes,
                Status = "Pending",
                CreatedBy = userName,
                CreatedDate = DateTime.Now,
                IsActive = true
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();
            return Ok(ServiceResult.Created("Appointment scheduled successfully"));
        }

        [HttpGet("my-appointments")]
        public async Task<ActionResult<ServiceResult<List<AppointmentResponse>>>> GetMyAppointments()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

            var appointments = await _context.Appointments
                .Include(a => a.BuyerUser)
                .Include(a => a.SellerUser)
                .Include(a => a.ProjectMaster)
                .Where(a => (a.BuyerUserId == userId || a.SellerUserId == userId) && a.IsActive)
                .OrderByDescending(a => a.ScheduledDate)
                .Select(a => new AppointmentResponse
                {
                    Id = a.Id,
                    BuyerUserId = a.BuyerUserId,
                    BuyerUserName = a.BuyerUser.FirstName + " " + a.BuyerUser.LastName,
                    SellerUserId = a.SellerUserId,
                    SellerUserName = a.SellerUser.FirstName + " " + a.SellerUser.LastName,
                    ProjectId = a.ProjectId,
                    ProjectName = a.ProjectMaster.ProjectName,
                    ScheduledDate = a.ScheduledDate,
                    TimeSlot = a.TimeSlot,
                    Status = a.Status,
                    Notes = a.Notes,
                    CreatedDate = a.CreatedDate
                })
                .ToListAsync();

            return Ok(ServiceResult<List<AppointmentResponse>>.Ok(appointments));
        }

        [HttpPut("{id}/status")]
        public async Task<ActionResult<ServiceResult>> UpdateStatus(int id, [FromQuery] string status)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
                return NotFound(ServiceResult.NotFound("Appointment not found"));

            if (appointment.BuyerUserId != userId && appointment.SellerUserId != userId)
                return BadRequest(ServiceResult.Fail("Not authorized"));

            appointment.Status = status;
            appointment.ModifiedDate = DateTime.Now;
            appointment.ModifiedBy = User.FindFirst(ClaimTypes.Name)?.Value;
            await _context.SaveChangesAsync();
            return Ok(ServiceResult.Ok("Appointment status updated"));
        }
    }
}
