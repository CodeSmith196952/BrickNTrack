using BrickNTrack.Domain.CommonModel;
using BrickNTrack.Domain.Model;

namespace BrickNTrack.Business.Services
{
    public interface IProjectService
    {
        Task<ServiceResult<List<ProjectMasterResponse>>> GetAllProjectAsync();
        Task<ServiceResult<List<ProjectMasterResponse>>> GetAllActiveProjectAsync();
        Task<ServiceResult<ProjectMasterResponse>> GetProjectByIdAsync(int projectId);
        Task<ServiceResult> AddUpdateProjectAsync(ProjectMasterRequest request, string username);
        Task<ServiceResult<List<ProjectMasterResponse>>> GetAllProjectOfBuilderAsync(int builderId);
        Task<ServiceResult<List<ProjectMasterResponse>>> GetAllActiveProjectOfBuilderAsync(int builderId);
        Task<ServiceResult> SoftDeleteProjectAsync(int projectId, string username);
        Task<ServiceResult<PaginatedResult<ProjectMasterResponse>>> GetProjectsPaginatedAsync(PaginatedRequest request, int? builderId = null);
    }
}
