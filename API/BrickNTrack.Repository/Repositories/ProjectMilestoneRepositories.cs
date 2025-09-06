using AutoMapper;
using BrickNTrack.Doman.CommonModel;
using BrickNTrack.Doman.Model;
using BrickNTrack.Repository.Context;
using BrickNTrack.Repository.Entity;
using BrickNTrack.Repository.Interface;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using static BrickNTrack.Doman.CommonModel.ApplicationConstant;

namespace BrickNTrack.Repository.Repositories
{
    public class ProjectMilestoneRepositories : IProjectMilestone
    {
        private readonly BrickNTrackContext _context;
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;
        public ProjectMilestoneRepositories(BrickNTrackContext context,
            IConfiguration configuration, IMapper mapper)
        {
            _context = context;
            _config = configuration;
            _mapper = mapper;
        }

        public async Task<ResultModel> AddUpdateMilestonsAsync(ProjectMilestoneRequest request, string username)
        {
            ResultModel retValue = new ResultModel();
            try
            {
                var project = await _context.ProjectMasters.FirstOrDefaultAsync(x => x.ProjectId == request.ProjectId);
                if (project == null) 
                {
                    retValue.StatusCode = ResultCode.RecordNotFound;
                    retValue.ErrorMessage = "Project details not found";
                    return retValue;
                }
                if (request.MilestoneId == 0)
                {
                    request.CreatedBy = username;
                    request.CreatedDate = CommonHelper.GetISTTime(DateTime.Now);
                    request.BudgetStatus = BudgetStatusConstant.InBudget;
                    request.Status = MilestoneStatus.New;
                    if (request.PlannedStartDate.HasValue && request.PlannedTargetDate.HasValue)
                    {
                        TimeSpan planedDuration = request.PlannedTargetDate.Value - request.PlannedStartDate.Value;
                        request.PlannedDuration = (int)planedDuration.TotalDays;
                    }
                    var milestone = _mapper.Map<ProjectMilestone>(request);
                    _context.ProjectMilestones.Add(milestone);
                    await _context.SaveChangesAsync();
                    retValue.StatusCode = ResultCode.SuccessfullyCreated;
                    retValue.ResponseMessage = "Milestone added successfully";
                }
                else
                {
                    var milestone = await _context.ProjectMilestones.FirstOrDefaultAsync(x => x.MilestoneId == request.MilestoneId);
                    if (milestone != null)
                    {
                        if (request.ProjectId != milestone.ProjectId)
                            milestone.ProjectId = request.ProjectId;

                        if (request.MilestoneName != milestone.MilestoneName)
                            milestone.MilestoneName = request.MilestoneName;

                        if (request.MilestoneDetails != milestone.MilestoneDetails)
                            milestone.MilestoneDetails = request.MilestoneDetails;

                        if (request.Budget != milestone.Budget)
                            milestone.Budget = request.Budget;

                        if (request.Status != milestone.Status)
                            milestone.Status = request.Status;

                        if (request.PlannedStartDate != milestone.PlannedStartDate)
                            milestone.PlannedStartDate = request.PlannedStartDate;

                        if (request.PlannedTargetDate != milestone.PlannedTargetDate)
                            milestone.PlannedTargetDate = request.PlannedTargetDate;

                        if (request.MilestoneCompletionPer != milestone.MilestoneCompletionPer)
                            milestone.MilestoneCompletionPer = request.MilestoneCompletionPer;

                        if (request.PlannedStartDate.HasValue && request.PlannedTargetDate.HasValue)
                        {
                            TimeSpan planedDuration = request.PlannedTargetDate.Value - request.PlannedStartDate.Value;
                            milestone.PlannedDuration = (int)planedDuration.TotalDays;
                        }

                        if (request.Status == MilestoneStatus.InProgress)
                            milestone.ActualStartDate = CommonHelper.GetISTTime(DateTime.Now);
                        else if (request.Status == MilestoneStatus.Completed)
                        {
                            milestone.ActualTargetDate = CommonHelper.GetISTTime(DateTime.Now);
                            TimeSpan actualDuration = milestone.ActualTargetDate.Value - milestone.ActualStartDate.Value;
                            milestone.ActualDuration = (int)actualDuration.TotalDays;
                            milestone.IsActive = false;
                        }
                        if (request.Status == MilestoneStatus.Completed)
                            milestone.IsActive = request.IsActive;
                        milestone.ModifiedBy = username;
                        milestone.ModifiedDate = CommonHelper.GetISTTime(DateTime.Now);
                        _context.ProjectMilestones.Update(milestone);
                        await _context.SaveChangesAsync();

                        retValue.StatusCode = ResultCode.SuccessfullyUpdated;
                        retValue.ResponseMessage = "Milestone updated successfully";
                    }
                    else
                    {
                        retValue.StatusCode = ResultCode.RecordNotFound;
                        retValue.ErrorMessage = "Milestone details not found";
                    }
                }
            }
            catch (Exception ex)
            {
                retValue.StatusCode = ResultCode.Invalid;
                retValue.ErrorMessage = ex.Message;
            }
            return retValue;
        }

        public async Task<List<ProjectMilestoneResponse>> GetAllMilestonesAsync()
        {
            try
            {
                var milestones = await _context.ProjectMilestones.Include(x => x.ProjectMaster).ToListAsync();
                return _mapper.Map<List<ProjectMilestoneResponse>>(milestones);
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<List<ProjectMilestoneResponse>> GetAllActiveMilestonesAsync()
        {
            try
            {
                var milestones = await _context.ProjectMilestones.Include(x => x.ProjectMaster).Where(x => x.IsActive == true).ToListAsync();
                return _mapper.Map<List<ProjectMilestoneResponse>>(milestones);
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<ProjectMilestoneResponse> GetMilestonesByIdAsync(int milestoneId)
        {
            try
            {
                var milestones = await _context.ProjectMilestones.Include(x => x.ProjectMaster).FirstOrDefaultAsync(x => x.MilestoneId == milestoneId);
                return _mapper.Map<ProjectMilestoneResponse>(milestones);
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<List<ProjectMilestoneResponse>> GetMilestonesByProjectIdAsync(int projectId)
        {
            try
            {
                var milestones = await _context.ProjectMilestones.Include(x => x.ProjectMaster).Where(x => x.ProjectId == projectId).ToListAsync();
                return _mapper.Map<List<ProjectMilestoneResponse>>(milestones);
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
