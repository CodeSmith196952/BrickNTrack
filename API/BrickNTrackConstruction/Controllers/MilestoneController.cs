using BrickNTrack.Doman.Model;
using BrickNTrack.Repository.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using static BrickNTrack.Doman.CommonModel.ApplicationConstant;

namespace BrickNTrackConstruction.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MilestoneController : ControllerBase
    {
        private readonly IProjectMilestone _projectMilestone;

        public MilestoneController(IProjectMilestone projectMilestone)
        {
            _projectMilestone = projectMilestone;
        }

        [Route("addUpdateMilestone")]
        [HttpPost]
        public async Task<IActionResult> AddUpdateMilestonsAsync([FromBody] ProjectMilestoneRequest request)
        {
            var userName = User.FindFirst(ClaimTypes.Name)?.Value;
            var result = await _projectMilestone.AddUpdateMilestonsAsync(request, userName);
            if (result.StatusCode == ResultCode.SuccessfullyCreated || result.StatusCode == ResultCode.SuccessfullyUpdated)
                return Ok(result);
            else
                return NotFound(result);
        }

        [Route("getAllMilestones")]
        [HttpGet]
        public async Task<List<ProjectMilestoneResponse>> GetAllMilestonesAsync()
        {
            var result = await _projectMilestone.GetAllMilestonesAsync();
            return result;
        }

        [Route("getAllActiveMilestones")]
        [HttpGet]
        public async Task<List<ProjectMilestoneResponse>> GetAllActiveMilestonesAsync()
        {
            var result = await _projectMilestone.GetAllActiveMilestonesAsync();
            return result;
        }

        [Route("getMilestonesById")]
        [HttpGet]
        public async Task<ProjectMilestoneResponse> GetMilestonesByIdAsync([FromQuery] int milestoneId)
        {
            var result = await _projectMilestone.GetMilestonesByIdAsync(milestoneId);
            return result;
        }

        [Route("getMilestonesByProjectId")]
        [HttpGet]
        public async Task<List<ProjectMilestoneResponse>> GetMilestonesByProjectIdAsync([FromQuery] int projectId)
        {
            var result = await _projectMilestone.GetMilestonesByProjectIdAsync(projectId);
            return result;
        }
    }
}
