using AutoMapper;
using BrickNTrack.Domain.CommonModel;
using BrickNTrack.Domain.Model;
using BrickNTrack.Repository.Interface;
using Microsoft.EntityFrameworkCore;

namespace BrickNTrack.Business.Services
{
    public class ProjectService : IProjectService
    {
        private readonly IProject _project;
        private readonly IMapper _mapper;

        public ProjectService(IProject project, IMapper mapper)
        {
            _project = project;
            _mapper = mapper;
        }

        public async Task<ServiceResult<List<ProjectMasterResponse>>> GetAllProjectAsync()
        {
            var result = await _project.GetAllProjectAsync();
            return ServiceResult<List<ProjectMasterResponse>>.Ok(result ?? new List<ProjectMasterResponse>());
        }

        public async Task<ServiceResult<List<ProjectMasterResponse>>> GetAllActiveProjectAsync()
        {
            var result = await _project.GetAllActiveProjectAsync();
            return ServiceResult<List<ProjectMasterResponse>>.Ok(result ?? new List<ProjectMasterResponse>());
        }

        public async Task<ServiceResult<ProjectMasterResponse>> GetProjectByIdAsync(int projectId)
        {
            var result = await _project.GetProjectbyIdAsync(projectId);
            if (result == null)
                return ServiceResult<ProjectMasterResponse>.NotFound("Project not found");
            return ServiceResult<ProjectMasterResponse>.Ok(result);
        }

        public async Task<ServiceResult> AddUpdateProjectAsync(ProjectMasterRequest request, string username)
        {
            var result = await _project.AddUpdateProjectAsync(request, username);

            if (result.StatusCode == ApplicationConstant.ResultCode.SuccessfullyCreated)
                return ServiceResult.Created(result.ResponseMessage);
            if (result.StatusCode == ApplicationConstant.ResultCode.SuccessfullyUpdated)
                return ServiceResult.Ok(result.ResponseMessage);
            if (result.StatusCode == ApplicationConstant.ResultCode.RecordNotFound)
                return ServiceResult.NotFound(result.ErrorMessage);
            if (result.StatusCode == ApplicationConstant.ResultCode.DuplicateRecord)
                return ServiceResult.Conflict(result.ErrorMessage);

            return ServiceResult.Fail(result.ErrorMessage ?? "Operation failed");
        }

        public async Task<ServiceResult<List<ProjectMasterResponse>>> GetAllProjectOfBuilderAsync(int builderId)
        {
            var result = await _project.GetAllProjectOfBuilderAsync(builderId);
            return ServiceResult<List<ProjectMasterResponse>>.Ok(result ?? new List<ProjectMasterResponse>());
        }

        public async Task<ServiceResult<List<ProjectMasterResponse>>> GetAllActiveProjectOfBuilderAsync(int builderId)
        {
            var result = await _project.GetAllActiveOfBuilderProjectAsync(builderId);
            return ServiceResult<List<ProjectMasterResponse>>.Ok(result ?? new List<ProjectMasterResponse>());
        }

        public async Task<ServiceResult> SoftDeleteProjectAsync(int projectId, string username)
        {
            var project = await _project.GetProjectbyIdAsync(projectId);
            if (project == null)
                return ServiceResult.NotFound("Project not found");

            var request = new ProjectMasterRequest
            {
                ProjectId = projectId,
                ProjectName = project.ProjectName,
                ProjectDescription = project.ProjectDescription,
                CompletionPercentage = project.CompletionPercentage,
                StartDate = project.StartDate,
                CompletionDate = project.CompletionDate,
                ProjectAddress = project.ProjectAddress,
                ProfileImage = project.ProfileImage,
                ReraNumber = project.ReraNumber,
                Budget = project.Budget,
                Status = project.Status,
                BuilderId = project.BuilderId,
                IsActive = false
            };
            var result = await _project.AddUpdateProjectAsync(request, username);
            return result.StatusCode == ApplicationConstant.ResultCode.SuccessfullyUpdated
                ? ServiceResult.Ok("Project deleted successfully")
                : ServiceResult.Fail("Failed to delete project");
        }

        public async Task<ServiceResult<PaginatedResult<ProjectMasterResponse>>> GetProjectsPaginatedAsync(PaginatedRequest request, int? builderId = null)
        {
            var query = _project.QueryProjects();

            // Filter by builder if specified
            if (builderId.HasValue)
                query = query.Where(p => p.BuilderId == builderId.Value);

            // Apply search filter (translated to SQL WHERE)
            if (!string.IsNullOrWhiteSpace(request.SearchText))
            {
                var search = request.SearchText.ToLower();
                query = query.Where(p =>
                    (p.ProjectName != null && p.ProjectName.ToLower().Contains(search)) ||
                    (p.ProjectAddress != null && p.ProjectAddress.ToLower().Contains(search)) ||
                    (p.BuilderMaster != null && p.BuilderMaster.Name != null && p.BuilderMaster.Name.ToLower().Contains(search)) ||
                    (p.City != null && p.City.ToLower().Contains(search))
                );
            }

            // Apply sorting (translated to SQL ORDER BY)
            if (!string.IsNullOrWhiteSpace(request.SortBy))
            {
                query = request.SortBy.ToLower() switch
                {
                    "name" => request.SortDescending
                        ? query.OrderByDescending(p => p.ProjectName)
                        : query.OrderBy(p => p.ProjectName),
                    "budget" or "price" => request.SortDescending
                        ? query.OrderByDescending(p => p.Budget)
                        : query.OrderBy(p => p.Budget),
                    "completion" => request.SortDescending
                        ? query.OrderByDescending(p => p.CompletionPercentage)
                        : query.OrderBy(p => p.CompletionPercentage),
                    "date" => request.SortDescending
                        ? query.OrderByDescending(p => p.StartDate)
                        : query.OrderBy(p => p.StartDate),
                    _ => query.OrderBy(p => p.ProjectId)
                };
            }
            else
            {
                query = query.OrderBy(p => p.ProjectId);
            }

            // SQL COUNT
            var totalCount = await query.CountAsync();

            // SQL OFFSET/FETCH (Skip/Take)
            var projects = await query
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync();

            // Map to DTOs after materialization
            var items = _mapper.Map<List<ProjectMasterResponse>>(projects);

            var result = PaginatedResult<ProjectMasterResponse>.Create(items, totalCount, request.Page, request.PageSize);
            return ServiceResult<PaginatedResult<ProjectMasterResponse>>.Ok(result);
        }
    }
}
