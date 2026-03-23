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
    public class ReviewController : ControllerBase
    {
        private readonly BrickNTrackContext _context;

        public ReviewController(BrickNTrackContext context)
        {
            _context = context;
        }

        [HttpGet("project/{projectId}")]
        [AllowAnonymous]
        public async Task<ActionResult<ServiceResult<List<ReviewResponse>>>> GetByProject(int projectId)
        {
            var reviews = await _context.Reviews
                .Include(r => r.BuyerUser)
                .Where(r => r.ProjectId == projectId && r.IsActive)
                .OrderByDescending(r => r.CreatedDate)
                .Select(r => new ReviewResponse
                {
                    Id = r.Id,
                    ProjectId = r.ProjectId,
                    BuyerUserId = r.BuyerUserId,
                    BuyerUserName = r.BuyerUser.FirstName + " " + r.BuyerUser.LastName,
                    OverallRating = r.OverallRating,
                    QualityRating = r.QualityRating,
                    ValueRating = r.ValueRating,
                    LocationRating = r.LocationRating,
                    ReviewText = r.ReviewText,
                    BuilderResponse = r.BuilderResponse,
                    BuilderResponseDate = r.BuilderResponseDate,
                    CreatedDate = r.CreatedDate
                })
                .ToListAsync();

            return Ok(ServiceResult<List<ReviewResponse>>.Ok(reviews));
        }

        [HttpPost]
        [Authorize(Roles = Roles.Buyer)]
        public async Task<ActionResult<ServiceResult>> CreateReview([FromBody] ReviewRequest request)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var userName = User.FindFirst(ClaimTypes.Name)?.Value!;

            var existing = await _context.Reviews.FirstOrDefaultAsync(r => r.ProjectId == request.ProjectId && r.BuyerUserId == userId && r.IsActive);
            if (existing != null)
                return Conflict(ServiceResult.Conflict("You have already reviewed this property"));

            var review = new Review
            {
                ProjectId = request.ProjectId,
                BuyerUserId = userId,
                OverallRating = request.OverallRating,
                QualityRating = request.QualityRating,
                ValueRating = request.ValueRating,
                LocationRating = request.LocationRating,
                ReviewText = request.ReviewText,
                CreatedBy = userName,
                CreatedDate = DateTime.Now,
                IsActive = true
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();
            return Ok(ServiceResult.Created("Review submitted successfully"));
        }

        [HttpPost("builder-response")]
        [Authorize(Roles = Roles.AdminOrBuilder)]
        public async Task<ActionResult<ServiceResult>> AddBuilderResponse([FromBody] BuilderResponseRequest request)
        {
            var review = await _context.Reviews.FindAsync(request.ReviewId);
            if (review == null)
                return NotFound(ServiceResult.NotFound("Review not found"));

            review.BuilderResponse = request.Response;
            review.BuilderResponseDate = DateTime.Now;
            await _context.SaveChangesAsync();
            return Ok(ServiceResult.Ok("Builder response added"));
        }
    }
}
