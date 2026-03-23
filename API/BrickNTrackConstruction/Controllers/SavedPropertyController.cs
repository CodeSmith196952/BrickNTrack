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
    public class SavedPropertyController : ControllerBase
    {
        private readonly BrickNTrackContext _context;

        public SavedPropertyController(BrickNTrackContext context)
        {
            _context = context;
        }

        [HttpPost("{projectId}")]
        public async Task<ActionResult<ServiceResult>> Save(int projectId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var userName = User.FindFirst(ClaimTypes.Name)?.Value!;

            var existing = await _context.SavedProperties.FirstOrDefaultAsync(s => s.UserId == userId && s.ProjectId == projectId);
            if (existing != null)
                return Ok(ServiceResult.Ok("Property already saved"));

            var saved = new SavedProperty
            {
                UserId = userId,
                ProjectId = projectId,
                CreatedBy = userName,
                ModifiedBy = userName,
                CreatedDate = DateTime.Now,
                IsActive = true
            };

            _context.SavedProperties.Add(saved);
            await _context.SaveChangesAsync();
            return Ok(ServiceResult.Created("Property saved"));
        }

        [HttpDelete("{projectId}")]
        public async Task<ActionResult<ServiceResult>> Unsave(int projectId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var saved = await _context.SavedProperties.FirstOrDefaultAsync(s => s.UserId == userId && s.ProjectId == projectId);
            if (saved == null)
                return NotFound(ServiceResult.NotFound("Saved property not found"));

            _context.SavedProperties.Remove(saved);
            await _context.SaveChangesAsync();
            return Ok(ServiceResult.Ok("Property unsaved"));
        }

        [HttpGet]
        public async Task<ActionResult<ServiceResult<List<ProjectMasterResponse>>>> GetSavedProperties()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

            var saved = await _context.SavedProperties
                .Include(s => s.ProjectMaster)
                    .ThenInclude(p => p.BuilderMaster)
                .Where(s => s.UserId == userId)
                .Select(s => new ProjectMasterResponse
                {
                    ProjectId = s.ProjectMaster.ProjectId,
                    ProjectName = s.ProjectMaster.ProjectName,
                    ProjectDescription = s.ProjectMaster.ProjectDescription,
                    ProjectAddress = s.ProjectMaster.ProjectAddress,
                    ProfileImage = s.ProjectMaster.ProfileImage,
                    Budget = s.ProjectMaster.Budget,
                    Status = s.ProjectMaster.Status,
                    BuilderId = s.ProjectMaster.BuilderId,
                    BuilderName = s.ProjectMaster.BuilderMaster.Name,
                    PropertyType = s.ProjectMaster.PropertyType,
                    Bedrooms = s.ProjectMaster.Bedrooms,
                    City = s.ProjectMaster.City,
                    CompletionPercentage = s.ProjectMaster.CompletionPercentage
                })
                .ToListAsync();

            return Ok(ServiceResult<List<ProjectMasterResponse>>.Ok(saved));
        }

        [HttpGet("check/{projectId}")]
        public async Task<ActionResult<ServiceResult<bool>>> IsSaved(int projectId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var exists = await _context.SavedProperties.AnyAsync(s => s.UserId == userId && s.ProjectId == projectId);
            return Ok(ServiceResult<bool>.Ok(exists));
        }
    }
}
