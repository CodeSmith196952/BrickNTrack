using BrickNTrack.Domain.CommonModel;
using BrickNTrack.Domain.Model;
using BrickNTrack.Repository.Context;
using BrickNTrack.Repository.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BrickNTrackConstruction.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AmenityController : ControllerBase
    {
        private readonly BrickNTrackContext _context;

        public AmenityController(BrickNTrackContext context)
        {
            _context = context;
        }

        /// <summary>Get all amenities grouped by category</summary>
        [HttpGet("all")]
        public async Task<ActionResult<ServiceResult<List<AmenityMasterResponse>>>> GetAll()
        {
            var amenities = await _context.AmenityMasters
                .OrderBy(a => a.Category).ThenBy(a => a.Name)
                .Select(a => new AmenityMasterResponse
                {
                    AmenityId = a.AmenityId,
                    Name = a.Name,
                    Icon = a.Icon,
                    Category = a.Category
                })
                .ToListAsync();

            return Ok(ServiceResult<List<AmenityMasterResponse>>.Ok(amenities));
        }

        /// <summary>Get amenities for a specific project</summary>
        [HttpGet("project/{projectId}")]
        public async Task<ActionResult<ServiceResult<List<AmenityMasterResponse>>>> GetByProject(int projectId)
        {
            var amenities = await _context.ProjectAmenities
                .Where(pa => pa.ProjectId == projectId)
                .Include(pa => pa.AmenityMaster)
                .Select(pa => new AmenityMasterResponse
                {
                    AmenityId = pa.AmenityMaster.AmenityId,
                    Name = pa.AmenityMaster.Name,
                    Icon = pa.AmenityMaster.Icon,
                    Category = pa.AmenityMaster.Category
                })
                .ToListAsync();

            return Ok(ServiceResult<List<AmenityMasterResponse>>.Ok(amenities));
        }

        /// <summary>Update amenities for a project (replace all)</summary>
        [HttpPost("project/{projectId}")]
        [Authorize(Roles = "Admin,Builder")]
        public async Task<ActionResult<ServiceResult>> UpdateProjectAmenities(int projectId, [FromBody] List<int> amenityIds)
        {
            // Remove existing
            var existing = await _context.ProjectAmenities.Where(pa => pa.ProjectId == projectId).ToListAsync();
            _context.ProjectAmenities.RemoveRange(existing);

            // Add new
            foreach (var amenityId in amenityIds.Distinct())
            {
                _context.ProjectAmenities.Add(new ProjectAmenity
                {
                    ProjectId = projectId,
                    AmenityId = amenityId
                });
            }

            await _context.SaveChangesAsync();
            return Ok(ServiceResult.Ok("Amenities updated successfully"));
        }

        /// <summary>Add a new amenity (admin only)</summary>
        [HttpPost("add")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ServiceResult>> AddAmenity([FromBody] AmenityMasterResponse request)
        {
            var amenity = new AmenityMaster
            {
                Name = request.Name,
                Icon = request.Icon,
                Category = request.Category,
                CreatedBy = "Admin",
                CreatedDate = DateTime.UtcNow,
                IsActive = true
            };
            _context.AmenityMasters.Add(amenity);
            await _context.SaveChangesAsync();
            return Ok(ServiceResult.Ok("Amenity added"));
        }
    }
}
