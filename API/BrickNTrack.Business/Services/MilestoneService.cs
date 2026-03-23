using BrickNTrack.Domain.CommonModel;
using BrickNTrack.Domain.Model;
using BrickNTrack.Repository.Interface;

namespace BrickNTrack.Business.Services
{
    public class MilestoneService : IMilestoneService
    {
        private readonly IProjectMilestone _milestoneRepo;

        public MilestoneService(IProjectMilestone milestoneRepo)
        {
            _milestoneRepo = milestoneRepo;
        }

        public async Task<ServiceResult> AddUpdateMilestoneAsync(ProjectMilestoneRequest request, string username)
        {
            var result = await _milestoneRepo.AddUpdateMilestonsAsync(request, username);

            if (result.StatusCode == ApplicationConstant.ResultCode.SuccessfullyCreated)
                return ServiceResult.Created(result.ResponseMessage);
            if (result.StatusCode == ApplicationConstant.ResultCode.SuccessfullyUpdated)
                return ServiceResult.Ok(result.ResponseMessage);
            if (result.StatusCode == ApplicationConstant.ResultCode.RecordNotFound)
                return ServiceResult.NotFound(result.ErrorMessage);

            return ServiceResult.Fail(result.ErrorMessage ?? "Operation failed");
        }

        public async Task<ServiceResult<List<ProjectMilestoneResponse>>> GetAllMilestonesAsync()
        {
            var result = await _milestoneRepo.GetAllMilestonesAsync();
            return ServiceResult<List<ProjectMilestoneResponse>>.Ok(result ?? new List<ProjectMilestoneResponse>());
        }

        public async Task<ServiceResult<List<ProjectMilestoneResponse>>> GetAllActiveMilestonesAsync()
        {
            var result = await _milestoneRepo.GetAllActiveMilestonesAsync();
            return ServiceResult<List<ProjectMilestoneResponse>>.Ok(result ?? new List<ProjectMilestoneResponse>());
        }

        public async Task<ServiceResult<ProjectMilestoneResponse>> GetMilestoneByIdAsync(int milestoneId)
        {
            var result = await _milestoneRepo.GetMilestonesByIdAsync(milestoneId);
            if (result == null)
                return ServiceResult<ProjectMilestoneResponse>.NotFound("Milestone not found");
            return ServiceResult<ProjectMilestoneResponse>.Ok(result);
        }

        public async Task<ServiceResult<List<ProjectMilestoneResponse>>> GetMilestonesByProjectIdAsync(int projectId)
        {
            var result = await _milestoneRepo.GetMilestonesByProjectIdAsync(projectId);
            return ServiceResult<List<ProjectMilestoneResponse>>.Ok(result ?? new List<ProjectMilestoneResponse>());
        }

        public async Task<ServiceResult> SoftDeleteMilestoneAsync(int milestoneId, string username)
        {
            var milestone = await _milestoneRepo.GetMilestonesByIdAsync(milestoneId);
            if (milestone == null)
                return ServiceResult.NotFound("Milestone not found");

            var request = new ProjectMilestoneRequest
            {
                MilestoneId = milestoneId,
                ProjectId = milestone.ProjectId,
                MilestoneName = milestone.MilestoneName,
                MilestoneDetails = milestone.MilestoneDetails,
                Budget = milestone.Budget,
                Status = milestone.Status,
                PlannedStartDate = milestone.PlannedStartDate,
                PlannedTargetDate = milestone.PlannedTargetDate,
                MilestoneCompletionPer = milestone.MilestoneCompletionPer,
                IsActive = false
            };
            var result = await _milestoneRepo.AddUpdateMilestonsAsync(request, username);
            return result.StatusCode == ApplicationConstant.ResultCode.SuccessfullyUpdated
                ? ServiceResult.Ok("Milestone deleted successfully")
                : ServiceResult.Fail("Failed to delete milestone");
        }
    }
}
