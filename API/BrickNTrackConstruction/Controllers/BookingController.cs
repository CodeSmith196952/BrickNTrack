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
    public class BookingController : ControllerBase
    {
        private readonly BrickNTrackContext _context;

        public BookingController(BrickNTrackContext context)
        {
            _context = context;
        }

        [HttpPost]
        [Authorize(Roles = Roles.Buyer)]
        public async Task<ActionResult<ServiceResult>> CreateBooking([FromBody] PropertyBookingRequest request)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var userName = User.FindFirst(ClaimTypes.Name)?.Value!;

            var project = await _context.ProjectMasters.FindAsync(request.ProjectId);
            if (project == null)
                return NotFound(ServiceResult.NotFound("Property not found"));

            var booking = new PropertyBooking
            {
                ProjectId = request.ProjectId,
                BuyerUserId = userId,
                BookingAmount = request.BookingAmount,
                PaymentMode = request.PaymentMode,
                TransactionId = request.TransactionId,
                Notes = request.Notes,
                PaymentStatus = "Pending",
                CreatedBy = userName,
                CreatedDate = DateTime.Now,
                IsActive = true
            };

            _context.PropertyBookings.Add(booking);
            await _context.SaveChangesAsync();
            return Ok(ServiceResult.Created("Booking created successfully"));
        }

        [HttpGet("my-bookings")]
        [Authorize(Roles = Roles.Buyer)]
        public async Task<ActionResult<ServiceResult<List<PropertyBookingResponse>>>> GetMyBookings()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

            var bookings = await _context.PropertyBookings
                .Include(b => b.ProjectMaster)
                .Include(b => b.BuyerUser)
                .Where(b => b.BuyerUserId == userId && b.IsActive)
                .OrderByDescending(b => b.CreatedDate)
                .Select(b => new PropertyBookingResponse
                {
                    Id = b.Id,
                    ProjectId = b.ProjectId,
                    ProjectName = b.ProjectMaster.ProjectName,
                    BuyerUserId = b.BuyerUserId,
                    BuyerUserName = b.BuyerUser.FirstName + " " + b.BuyerUser.LastName,
                    BookingAmount = b.BookingAmount,
                    PaymentStatus = b.PaymentStatus,
                    PaymentMode = b.PaymentMode,
                    TransactionId = b.TransactionId,
                    Notes = b.Notes,
                    CreatedDate = b.CreatedDate
                })
                .ToListAsync();

            return Ok(ServiceResult<List<PropertyBookingResponse>>.Ok(bookings));
        }

        [HttpGet("project/{projectId}")]
        [Authorize(Roles = Roles.AdminOrBuilder)]
        public async Task<ActionResult<ServiceResult<List<PropertyBookingResponse>>>> GetProjectBookings(int projectId)
        {
            var bookings = await _context.PropertyBookings
                .Include(b => b.ProjectMaster)
                .Include(b => b.BuyerUser)
                .Where(b => b.ProjectId == projectId && b.IsActive)
                .OrderByDescending(b => b.CreatedDate)
                .Select(b => new PropertyBookingResponse
                {
                    Id = b.Id,
                    ProjectId = b.ProjectId,
                    ProjectName = b.ProjectMaster.ProjectName,
                    BuyerUserId = b.BuyerUserId,
                    BuyerUserName = b.BuyerUser.FirstName + " " + b.BuyerUser.LastName,
                    BookingAmount = b.BookingAmount,
                    PaymentStatus = b.PaymentStatus,
                    PaymentMode = b.PaymentMode,
                    TransactionId = b.TransactionId,
                    CreatedDate = b.CreatedDate
                })
                .ToListAsync();

            return Ok(ServiceResult<List<PropertyBookingResponse>>.Ok(bookings));
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = Roles.AdminOrBuilder)]
        public async Task<ActionResult<ServiceResult>> UpdateBookingStatus(int id, [FromQuery] string status)
        {
            var booking = await _context.PropertyBookings.FindAsync(id);
            if (booking == null)
                return NotFound(ServiceResult.NotFound("Booking not found"));

            booking.PaymentStatus = status;
            booking.ModifiedDate = DateTime.Now;
            booking.ModifiedBy = User.FindFirst(ClaimTypes.Name)?.Value;
            await _context.SaveChangesAsync();
            return Ok(ServiceResult.Ok("Booking status updated"));
        }
    }
}
