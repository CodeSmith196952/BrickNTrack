using BrickNTrack.Domain.CommonModel;
using BrickNTrack.Domain.Model;

namespace BrickNTrack.Repository.Interface
{
    public interface IProjectMilestone
    {
        Task<ResultModel> AddUpdateMilestonsAsync(ProjectMilestoneRequest request, string username);
        Task<List<ProjectMilestoneResponse>> GetAllMilestonesAsync();
        Task<List<ProjectMilestoneResponse>> GetAllActiveMilestonesAsync();
        Task<ProjectMilestoneResponse> GetMilestonesByIdAsync(int milestoneId);
        Task<List<ProjectMilestoneResponse>> GetMilestonesByProjectIdAsync(int projectId);
    }
}
