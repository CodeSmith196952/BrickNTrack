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
    public class ConstructionProgressController : ControllerBase
    {
        private readonly BrickNTrackContext _context;
        private readonly IConfiguration _config;

        public ConstructionProgressController(BrickNTrackContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [AllowAnonymous]
        [HttpGet("project/{projectId}")]
        public async Task<ActionResult<ServiceResult<List<ConstructionStageProgressResponse>>>> GetByProject(int projectId)
        {
            var stages = await _context.ConstructionStageProgress
                .Include(s => s.StagePhotos.Where(p => p.IsActive))
                .Where(s => s.ProjectId == projectId && s.IsActive)
                .OrderBy(s => s.StageOrder)
                .Select(s => new ConstructionStageProgressResponse
                {
                    Id = s.Id,
                    ProjectId = s.ProjectId,
                    StageName = s.StageName,
                    StageOrder = s.StageOrder,
                    CompletionPercentage = s.CompletionPercentage,
                    PlannedStartDate = s.PlannedStartDate,
                    PlannedEndDate = s.PlannedEndDate,
                    ActualStartDate = s.ActualStartDate,
                    ActualEndDate = s.ActualEndDate,
                    Notes = s.Notes,
                    Status = s.Status,
                    StagePhotos = s.StagePhotos.Select(p => new StagePhotoResponse
                    {
                        Id = p.Id,
                        StageProgressId = p.StageProgressId,
                        PhotoPath = p.PhotoPath,
                        Caption = p.Caption
                    }).ToList()
                })
                .ToListAsync();

            return Ok(ServiceResult<List<ConstructionStageProgressResponse>>.Ok(stages));
        }

        [Authorize(Roles = Roles.AdminOrBuilder)]
        [HttpPost]
        public async Task<ActionResult<ServiceResult>> Create([FromBody] ConstructionStageProgressRequest request)
        {
            var userName = User.FindFirst(ClaimTypes.Name)?.Value!;
            var stage = new ConstructionStageProgress
            {
                ProjectId = request.ProjectId,
                StageName = request.StageName,
                StageOrder = request.StageOrder,
                CompletionPercentage = request.CompletionPercentage,
                PlannedStartDate = request.PlannedStartDate,
                PlannedEndDate = request.PlannedEndDate,
                ActualStartDate = request.ActualStartDate,
                ActualEndDate = request.ActualEndDate,
                Notes = request.Notes,
                Status = request.Status,
                CreatedBy = userName,
                CreatedDate = DateTime.Now,
                IsActive = true
            };

            _context.ConstructionStageProgress.Add(stage);
            await _context.SaveChangesAsync();
            return Ok(ServiceResult.Created("Stage progress created successfully"));
        }

        [Authorize(Roles = Roles.AdminOrBuilder)]
        [HttpPut("{id}")]
        public async Task<ActionResult<ServiceResult>> Update(int id, [FromBody] ConstructionStageProgressRequest request)
        {
            var userName = User.FindFirst(ClaimTypes.Name)?.Value!;
            var stage = await _context.ConstructionStageProgress.FindAsync(id);
            if (stage == null)
                return NotFound(ServiceResult.NotFound("Stage not found"));

            stage.StageName = request.StageName;
            stage.StageOrder = request.StageOrder;
            stage.CompletionPercentage = request.CompletionPercentage;
            stage.PlannedStartDate = request.PlannedStartDate;
            stage.PlannedEndDate = request.PlannedEndDate;
            stage.ActualStartDate = request.ActualStartDate;
            stage.ActualEndDate = request.ActualEndDate;
            stage.Notes = request.Notes;
            stage.Status = request.Status;
            stage.ModifiedBy = userName;
            stage.ModifiedDate = DateTime.Now;

            await _context.SaveChangesAsync();
            return Ok(ServiceResult.Ok("Stage progress updated successfully"));
        }

        [Authorize(Roles = Roles.AdminOrBuilder)]
        [HttpDelete("{id}")]
        public async Task<ActionResult<ServiceResult>> Delete(int id)
        {
            var userName = User.FindFirst(ClaimTypes.Name)?.Value!;
            var stage = await _context.ConstructionStageProgress.FindAsync(id);
            if (stage == null)
                return NotFound(ServiceResult.NotFound("Stage not found"));

            stage.IsActive = false;
            stage.ModifiedBy = userName;
            stage.ModifiedDate = DateTime.Now;
            await _context.SaveChangesAsync();
            return Ok(ServiceResult.Ok("Stage deleted successfully"));
        }

        [Authorize(Roles = Roles.AdminOrBuilder)]
        [HttpPost("{stageId}/photos")]
        public async Task<ActionResult<ServiceResult>> UploadPhoto(int stageId, IFormFile file, [FromForm] string? caption)
        {
            var userName = User.FindFirst(ClaimTypes.Name)?.Value!;
            var stage = await _context.ConstructionStageProgress.Include(s => s.ProjectMaster).FirstOrDefaultAsync(s => s.Id == stageId);
            if (stage == null)
                return NotFound(ServiceResult.NotFound("Stage not found"));

            var imageLocalPath = _config["AppSettings:ImageLocalDirectory"];
            var imageVirtualPath = _config["AppSettings:ImageVirtualDirectoryURL"];
            var fullPath = $"{imageLocalPath}/{stage.ProjectMaster.ProjectName}/stages";

            if (!Directory.Exists(fullPath))
                Directory.CreateDirectory(fullPath);

            var filePath = Path.Combine(fullPath, file.FileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var virtualPath = filePath.Replace(imageLocalPath!, imageVirtualPath!).Replace("\\", "/");

            var photo = new StagePhoto
            {
                StageProgressId = stageId,
                PhotoPath = virtualPath,
                Caption = caption,
                CreatedBy = userName,
                CreatedDate = DateTime.Now,
                IsActive = true
            };

            _context.StagePhotos.Add(photo);
            await _context.SaveChangesAsync();
            return Ok(ServiceResult.Created("Photo uploaded successfully"));
        }

        [HttpGet("summary/{projectId}")]
        public async Task<ActionResult<ServiceResult<object>>> GetSummary(int projectId)
        {
            var stages = await _context.ConstructionStageProgress
                .Where(s => s.ProjectId == projectId && s.IsActive)
                .ToListAsync();

            var summary = new
            {
                TotalStages = stages.Count,
                CompletedStages = stages.Count(s => s.Status == "Completed"),
                InProgressStages = stages.Count(s => s.Status == "In Progress"),
                OverallCompletion = stages.Any() ? (int)stages.Average(s => s.CompletionPercentage) : 0
            };

            return Ok(ServiceResult<object>.Ok(summary));
        }
    }
}
