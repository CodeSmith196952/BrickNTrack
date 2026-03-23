using BrickNTrack.Business.Services;
using BrickNTrack.Domain.CommonModel;
using BrickNTrack.Domain.Model;
using BrickNTrack.Repository.Context;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BrickNTrackConstruction.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProjectController : ControllerBase
    {
        private readonly IProjectService _projectService;
        private readonly IFileUploadService _fileUploadService;
        private readonly BrickNTrackContext _context;

        public ProjectController(IProjectService projectService, IFileUploadService fileUploadService, BrickNTrackContext context)
        {
            _projectService = projectService;
            _fileUploadService = fileUploadService;
            _context = context;
        }

        [HttpPost("addUpdateProject")]
        [Authorize(Roles = Roles.AdminOrBuilder)]
        public async Task<ActionResult<ServiceResult>> AddUpdateProject([FromForm] ProjectMasterRequest request)
        {
            var userName = User.FindFirst(ClaimTypes.Name)?.Value!;
            var builderIdClaim = User.FindFirst("BuilderId")?.Value;
            if (string.IsNullOrEmpty(builderIdClaim) || !int.TryParse(builderIdClaim, out var parsedBuilderId))
                return BadRequest(ServiceResult.Fail("Please login again."));
            request.BuilderId = parsedBuilderId;
            if (!request.IsActive && request.ProjectId > 0)
                request.IsActive = true; // Preserve IsActive on updates unless explicitly deactivating
            var result = await _fileUploadService.AddUpdateProjectImageAsync(request, userName);
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("getAllProject")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<ActionResult<ServiceResult<List<ProjectMasterResponse>>>> GetAllProject()
        {
            var result = await _projectService.GetAllProjectAsync();
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("getAllActiveProject")]
        [Authorize(Roles = Roles.All)]
        public async Task<ActionResult<ServiceResult<List<ProjectMasterResponse>>>> GetAllActiveProject()
        {
            var result = await _projectService.GetAllActiveProjectAsync();
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("getAllProjectOfBuilder")]
        [Authorize(Roles = Roles.AdminOrBuilder)]
        public async Task<ActionResult<ServiceResult<List<ProjectMasterResponse>>>> GetAllProjectOfBuilder()
        {
            var builderIdStr = User.FindFirst("BuilderId")?.Value;
            if (string.IsNullOrEmpty(builderIdStr) || !int.TryParse(builderIdStr, out var builderId) || builderId == 0)
            {
                // Admin without a builder - return all projects
                var allResult = await _projectService.GetAllProjectAsync();
                return StatusCode(allResult.StatusCode, allResult);
            }
            var result = await _projectService.GetAllProjectOfBuilderAsync(builderId);
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("getAllActiveProjectOfBuilder")]
        [Authorize(Roles = Roles.AdminOrBuilder)]
        public async Task<ActionResult<ServiceResult<List<ProjectMasterResponse>>>> GetAllActiveProjectOfBuilder()
        {
            var builderIdStr = User.FindFirst("BuilderId")?.Value;
            if (string.IsNullOrEmpty(builderIdStr) || !int.TryParse(builderIdStr, out var builderId) || builderId == 0)
            {
                var allResult = await _projectService.GetAllActiveProjectAsync();
                return StatusCode(allResult.StatusCode, allResult);
            }
            var result = await _projectService.GetAllActiveProjectOfBuilderAsync(builderId);
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("getProjectbyId")]
        [Authorize(Roles = Roles.All)]
        public async Task<ActionResult<ServiceResult<ProjectMasterResponse>>> GetProjectById([FromQuery] int projectId)
        {
            var result = await _projectService.GetProjectByIdAsync(projectId);
            return StatusCode(result.StatusCode, result);
        }

        [HttpPost("addUpdatePropertyImages")]
        [Authorize(Roles = Roles.AdminOrBuilder)]
        public async Task<ActionResult<ServiceResult>> AddUpdatePropertyImages([FromForm] ProjectDataPathRequest request)
        {
            var userName = User.FindFirst(ClaimTypes.Name)?.Value!;
            var result = await _fileUploadService.AddUpdatePropertyImagesAsync(request, userName);
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("getAllProjectDataDetail")]
        [Authorize(Roles = Roles.AdminOrBuilder)]
        public async Task<ActionResult<ServiceResult<List<ProjectDataPathResponse>>>> GetAllProjectDataDetail()
        {
            var result = await _fileUploadService.GetAllProjectDataDetailAsync();
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("getAllActiveProjectDataDetail")]
        [Authorize(Roles = Roles.All)]
        public async Task<ActionResult<ServiceResult<List<ProjectDataPathResponse>>>> GetAllActiveProjectDataDetail()
        {
            var result = await _fileUploadService.GetAllActiveProjectDataDetailAsync();
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("getProjectDataDetailById")]
        [Authorize(Roles = Roles.All)]
        public async Task<ActionResult<ServiceResult<ProjectDataPathResponse>>> GetProjectDataDetailById([FromQuery] int projectDataPathId)
        {
            var result = await _fileUploadService.GetProjectDataDetailByIdAsync(projectDataPathId);
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("getProjectDataDetailByProjectId")]
        [Authorize(Roles = Roles.All)]
        public async Task<ActionResult<ServiceResult<List<ProjectDataPathResponse>>>> GetProjectDataDetailByProjectId([FromQuery] int projectId)
        {
            var result = await _fileUploadService.GetProjectDataDetailByProjectIdAsync(projectId);
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("getProjectsPaginated")]
        [Authorize(Roles = Roles.All)]
        public async Task<ActionResult<ServiceResult<PaginatedResult<ProjectMasterResponse>>>> GetProjectsPaginated([FromQuery] PaginatedRequest request)
        {
            var builderIdVal = User.FindFirst("BuilderId")?.Value;
            int? builderIdInt = int.TryParse(builderIdVal, out var bid) && bid > 0 ? bid : null;
            var result = await _projectService.GetProjectsPaginatedAsync(request, builderIdInt);
            return StatusCode(result.StatusCode, result);
        }


        [HttpDelete("deleteProject")]
        [Authorize(Roles = Roles.AdminOrBuilder)]
        public async Task<ActionResult<ServiceResult>> DeleteProject([FromQuery] int projectId)
        {
            var userName = User.FindFirst(ClaimTypes.Name)?.Value!;
            var result = await _projectService.SoftDeleteProjectAsync(projectId, userName);
            return StatusCode(result.StatusCode, result);
        }
    }
}
