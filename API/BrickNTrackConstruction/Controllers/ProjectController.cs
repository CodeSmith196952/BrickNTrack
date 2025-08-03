using BrickNTrack.Doman.Model;
using BrickNTrack.Repository.Interface;
using BrickNTrack.Repository.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using static BrickNTrack.Doman.CommonModel.ApplicationConstant;

namespace BrickNTrackConstruction.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProjectController : ControllerBase
    {
        private readonly IProject _project;

        public ProjectController(IProject project)
        {
            _project = project;
        }

        [Route("addUpdateProject")]
        [HttpPost]
        public async Task<IActionResult> AddUpdateProjectAsync([FromBody] ProjectMasterRequest request)
        {
            var userName = User.FindFirst(ClaimTypes.Name)?.Value;
            var result = await _project.AddUpdateProjectAsync(request, userName);
            if (result.StatusCode == ResultCode.SuccessfullyCreated || result.StatusCode == ResultCode.SuccessfullyUpdated)
                return Ok(result);
            else
                return NotFound(result);
        }

        [Route("getAllProject")]
        [HttpGet]
        public async Task<List<ProjectMasterResponse>> GetAllProjectAsync()
        {
            var result = await _project.GetAllProjectAsync();
            return result;
        }

        [Route("getAllActiveProject")]
        [HttpGet]
        public async Task<List<ProjectMasterResponse>> GetAllActiveProjectAsync()
        {
            var result = await _project.GetAllActiveProjectAsync();
            return result;
        }

        [Route("getProjectbyId")]
        [HttpGet]
        public async Task<ProjectMasterResponse> GetProjectbyIdAsync([FromQuery] int projectId)
        {
            var result = await _project.GetProjectbyIdAsync(projectId);
            return result;
        }
    }
}
