using BrickNTrack.Business.Services;
using BrickNTrack.Domain.CommonModel;
using BrickNTrack.Domain.Model;
using Microsoft.AspNetCore.Mvc;

namespace BrickNTrackConstruction.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PropertyController : ControllerBase
    {
        private readonly IProjectService _projectService;

        public PropertyController(IProjectService projectService)
        {
            _projectService = projectService;
        }

        [HttpGet("getAllActiveProject")]
        public async Task<ActionResult<ServiceResult<List<ProjectMasterResponse>>>> GetAllActiveProject()
        {
            var result = await _projectService.GetAllActiveProjectAsync();
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("search")]
        public async Task<ActionResult<ServiceResult<PaginatedResult<ProjectMasterResponse>>>> SearchProperties([FromQuery] PaginatedRequest request)
        {
            var result = await _projectService.GetProjectsPaginatedAsync(request);
            return StatusCode(result.StatusCode, result);
        }
    }
}
