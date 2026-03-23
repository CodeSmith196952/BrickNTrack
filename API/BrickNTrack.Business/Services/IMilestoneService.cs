using BrickNTrack.Domain.CommonModel;
using BrickNTrack.Domain.Model;

namespace BrickNTrack.Business.Services
{
    public interface IMilestoneService
    {
        Task<ServiceResult> AddUpdateMilestoneAsync(ProjectMilestoneRequest request, string username);
        Task<ServiceResult<List<ProjectMilestoneResponse>>> GetAllMilestonesAsync();
        Task<ServiceResult<List<ProjectMilestoneResponse>>> GetAllActiveMilestonesAsync();
        Task<ServiceResult<ProjectMilestoneResponse>> GetMilestoneByIdAsync(int milestoneId);
        Task<ServiceResult<List<ProjectMilestoneResponse>>> GetMilestonesByProjectIdAsync(int projectId);
        Task<ServiceResult> SoftDeleteMilestoneAsync(int milestoneId, string username);
    }
}
