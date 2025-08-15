using BrickNTrack.Business.BusinessLogic;
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
        private readonly IProjectManager _projectManager;

        public ProjectController(IProject project)
        {
            _project = project;
        }

        [Route("addUpdateProject")]
        [HttpPost]
        public async Task<IActionResult> AddUpdateProjectAsync([FromBody] ProjectMasterRequest request)
        {
            var userName = User.FindFirst(ClaimTypes.Name)?.Value;
            var result = await _projectManager.AddUpdateImageAsync(request, userName);
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

        [Route("addUpdatePropertyImages")]
        [HttpPost]
        public async Task<IActionResult> AddUpdatePropertyImagesAsync([FromBody] ProjectDataPathRequest request)
        {
            var userName = User.FindFirst(ClaimTypes.Name)?.Value;
            var result = await _projectManager.AddUpdatePropertyImagesAsync(request, userName);
            if (result.StatusCode == ResultCode.SuccessfullyCreated || result.StatusCode == ResultCode.SuccessfullyUpdated)
                return Ok(result);
            else
                return NotFound(result);
        }

        [Route("getAllProjectDataDetail")]
        [HttpGet]
        public async Task<List<ProjectDataPathResponse>> GetAllProjectDataDetailAsync()
        {
            var result = await _project.GetAllProjectDataDetailAsync();
            return result;
        }

        [Route("getAllActiveProjectDataDetail")]
        [HttpGet]
        public async Task<List<ProjectDataPathResponse>> GetAllActiveProjectDataDetailAsync()
        {
            var result = await _project.GetAllActiveProjectDataDetailAsync();
            return result;
        }

        [Route("getProjectDataDetailById")]
        [HttpGet]
        public async Task<ProjectDataPathResponse> GetProjectDataDetailByIdAsync([FromQuery] int projectDataPathId)
        {
            var result = await _project.GetProjectDataDetailByIdAsync(projectDataPathId);
            return result;
        }

        [Route("getProjectDataDetailByProjectId")]
        [HttpGet]
        public async Task<List<ProjectDataPathResponse>> GetProjectDataDetailByProjectIdAsync([FromQuery] int projectId)
        {
            var result = await _project.GetProjectDataDetailByProjectIdAsync(projectId);
            return result;
        }
    }
}
