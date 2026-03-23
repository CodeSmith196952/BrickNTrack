using BrickNTrack.Business.Services;
using BrickNTrack.Domain.CommonModel;
using BrickNTrack.Domain.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BrickNTrackConstruction.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MilestoneController : ControllerBase
    {
        private readonly IMilestoneService _milestoneService;

        public MilestoneController(IMilestoneService milestoneService)
        {
            _milestoneService = milestoneService;
        }

        [HttpPost("addUpdateMilestone")]
        [Authorize(Roles = Roles.AdminOrBuilder)]
        public async Task<ActionResult<ServiceResult>> AddUpdateMilestone([FromBody] ProjectMilestoneRequest request)
        {
            var userName = User.FindFirst(ClaimTypes.Name)?.Value!;
            var result = await _milestoneService.AddUpdateMilestoneAsync(request, userName);
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("getAllMilestones")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<ActionResult<ServiceResult<List<ProjectMilestoneResponse>>>> GetAllMilestones()
        {
            var result = await _milestoneService.GetAllMilestonesAsync();
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("getAllActiveMilestones")]
        [Authorize(Roles = Roles.AdminOrBuilder)]
        public async Task<ActionResult<ServiceResult<List<ProjectMilestoneResponse>>>> GetAllActiveMilestones()
        {
            var result = await _milestoneService.GetAllActiveMilestonesAsync();
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("getMilestonesById")]
        [Authorize(Roles = Roles.AdminOrBuilder)]
        public async Task<ActionResult<ServiceResult<ProjectMilestoneResponse>>> GetMilestonesById([FromQuery] int milestoneId)
        {
            var result = await _milestoneService.GetMilestoneByIdAsync(milestoneId);
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("getMilestonesByProjectId")]
        [Authorize(Roles = Roles.AdminOrBuilder)]
        public async Task<ActionResult<ServiceResult<List<ProjectMilestoneResponse>>>> GetMilestonesByProjectId([FromQuery] int projectId)
        {
            var result = await _milestoneService.GetMilestonesByProjectIdAsync(projectId);
            return StatusCode(result.StatusCode, result);
        }

        [HttpDelete("deleteMilestone")]
        [Authorize(Roles = Roles.AdminOrBuilder)]
        public async Task<ActionResult<ServiceResult>> DeleteMilestone([FromQuery] int milestoneId)
        {
            var userName = User.FindFirst(ClaimTypes.Name)?.Value!;
            var result = await _milestoneService.SoftDeleteMilestoneAsync(milestoneId, userName);
            return StatusCode(result.StatusCode, result);
        }
    }
}
