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
    public class ProjectRepositories : IProject
    {
        private readonly BrickNTrackContext _context;
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;
        public ProjectRepositories(BrickNTrackContext context,
            IConfiguration configuration, IMapper mapper)
        {
            _context = context;
            _config = configuration;
            _mapper = mapper;
        }

        public async Task<List<ProjectMasterResponse>> GetAllProjectAsync()
        {
            try
            {
                var projects = await _context.ProjectMasters.ToListAsync();
                return _mapper.Map<List<ProjectMasterResponse>>(projects);
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<List<ProjectMasterResponse>> GetAllActiveProjectAsync()
        {
            try
            {
                var projects = await _context.ProjectMasters.Where(x => x.IsActive == true).ToListAsync();
                return _mapper.Map<List<ProjectMasterResponse>>(projects);
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<ProjectMasterResponse> GetProjectbyIdAsync(int projectId)
        {
            try
            {
                var projects = await _context.ProjectMasters.FirstOrDefaultAsync(x => x.ProjectId == projectId);
                return _mapper.Map<ProjectMasterResponse>(projects);
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<ResultModel> AddUpdateProjectAsync(ProjectMasterRequest request, string username)
        {
            ResultModel retValue = new ResultModel();
            try
            {
                var builder = await _context.BuilderMasters.FirstOrDefaultAsync(x => x.BuilderId == request.BuilderId);
                if (builder == null) 
                {
                    retValue.StatusCode = ResultCode.RecordNotFound;
                    retValue.ErrorMessage = "Builder not found";
                    return retValue;
                }

                var reraNummber = await _context.ProjectMasters.FirstOrDefaultAsync(x => x.ReraNumber == request.ReraNumber && x.ProjectId != request.ProjectId);
                if (reraNummber != null)
                {
                    retValue.StatusCode = ResultCode.RecordNotFound;
                    retValue.ErrorMessage = "RERA number already registered";
                    return retValue;
                }

                if (request.ProjectId == 0)
                {
                    request.CreatedBy = username;
                    request.CreatedDate = CommonHelper.GetISTTime(DateTime.Now);
                    var project = _mapper.Map<ProjectMaster>(request);
                    _context.ProjectMasters.Add(project);
                    await _context.SaveChangesAsync();
                    retValue.StatusCode = ResultCode.SuccessfullyCreated;
                    retValue.ErrorMessage = "Proporty added successfully";
                }
                else
                {
                   var project = await _context.ProjectMasters.FirstOrDefaultAsync(x => x.ProjectId == request.ProjectId);
                    if (project != null)
                    {
                        if (!string.IsNullOrWhiteSpace(request.ProjectName) && project.ProjectName != request.ProjectName)
                            project.ProjectName = request.ProjectName;
                        if (project.ProjectDescription != request.ProjectDescription)
                            project.ProjectDescription = request.ProjectDescription;
                        if (project.CompletionPercentage != request.CompletionPercentage)
                            project.CompletionPercentage = request.CompletionPercentage;
                        if (project.StartDate != request.StartDate)
                            project.StartDate = request.StartDate;
                        if (project.CompletionDate != request.CompletionDate)
                            project.CompletionDate = request.CompletionDate;
                        if (project.ActualStartDate != request.ActualStartDate)
                            project.ActualStartDate = request.ActualStartDate;
                        if (project.ActualCompletionDate != request.ActualCompletionDate)
                            project.ActualCompletionDate = request.ActualCompletionDate;
                        if (project.ProjectAddress != request.ProjectAddress)
                            project.ProjectAddress = request.ProjectAddress;
                        if (project.Latlong != request.Latlong)
                            project.Latlong = request.Latlong;
                        if (project.ProfileImage != request.ProfileImage)
                            project.ProfileImage = request.ProfileImage;
                        if (project.ReraNumber != request.ReraNumber)
                            project.ReraNumber = request.ReraNumber;
                        if (project.Budget != request.Budget)
                            project.Budget = request.Budget;
                        if (project.Status != request.Status)
                            project.Status = request.Status;
                        if (project.BuilderId != request.BuilderId)
                            project.BuilderId = request.BuilderId;
                        project.IsActive = request.IsActive;
                        project.ModifiedBy = username;
                        project.ModifiedDate = CommonHelper.GetISTTime(DateTime.Now);
                        _context.ProjectMasters.Update(project);
                        await _context.SaveChangesAsync();

                        retValue.StatusCode = ResultCode.SuccessfullyUpdated;
                        retValue.ErrorMessage = "Proporty updated successfully";
                    }
                    else
                    {
                        retValue.StatusCode = ResultCode.RecordNotFound;
                        retValue.ErrorMessage = "Record not found";
                    }
                }
            }
            catch (Exception ex)
            {
                retValue.ErrorMessage = ex.ToString();
                retValue.StatusCode = ResultCode.Invalid;
            }
            return retValue;
        }
    }
}
