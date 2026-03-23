using AutoMapper;
using BrickNTrack.Domain.CommonModel;
using BrickNTrack.Domain.Model;
using BrickNTrack.Repository.Context;
using BrickNTrack.Repository.Entity;
using BrickNTrack.Repository.Interface;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using static BrickNTrack.Domain.CommonModel.ApplicationConstant;

namespace BrickNTrack.Repository.Repositories
{
    public class ProjectRepositories : BaseRepository<ProjectMaster>, IProject
    {
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;
        public ProjectRepositories(BrickNTrackContext context,
            IConfiguration configuration, IMapper mapper) : base(context)
        {
            _config = configuration;
            _mapper = mapper;
        }

        public IQueryable<ProjectMaster> QueryProjects()
        {
            return _context.ProjectMasters.Include(x => x.BuilderMaster);
        }

        public async Task<List<ProjectMasterResponse>> GetAllProjectAsync()
        {
            try
            {
                var projects = await _context.ProjectMasters.IgnoreQueryFilters().Include(x => x.BuilderMaster).Include(x => x.ProjectMilestones).ThenInclude(x => x.ProjectExpenses).ToListAsync();
                var projectDetails = projects.Select(project =>
                {
                    var response = _mapper.Map<ProjectMasterResponse>(project);

                    // Compute total expenses from all milestones
                    var totalExpenses = project.ProjectMilestones
                        .SelectMany(m => m.ProjectExpenses)
                        .Sum(e => e.Amount);

                    response.TotalSpend = totalExpenses;

                    return response;
                }).ToList();
                return projectDetails;
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
                var projects = await _context.ProjectMasters.Include(x => x.BuilderMaster).Include(x => x.ProjectMilestones).ThenInclude(x => x.ProjectExpenses).ToListAsync();
                var projectDetails = projects.Select(project =>
                {
                    var response = _mapper.Map<ProjectMasterResponse>(project);

                    // Compute total expenses from all milestones
                    var totalExpenses = project.ProjectMilestones
                        .SelectMany(m => m.ProjectExpenses)
                        .Sum(e => e.Amount);

                    response.TotalSpend = totalExpenses;

                    return response;
                }).ToList();
                return projectDetails;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<List<ProjectMasterResponse>> GetAllProjectOfBuilderAsync(int builderId)
        {
            try
            {
                var projects = await _context.ProjectMasters.IgnoreQueryFilters().Include(x => x.BuilderMaster).Include(x => x.ProjectMilestones).ThenInclude(x => x.ProjectExpenses).Where(x => x.BuilderId == builderId).ToListAsync();
                var projectDetails = projects.Select(project =>
                {
                    var response = _mapper.Map<ProjectMasterResponse>(project);

                    // Compute total expenses from all milestones
                    var totalExpenses = project.ProjectMilestones
                        .SelectMany(m => m.ProjectExpenses)
                        .Sum(e => e.Amount);

                    response.TotalSpend = totalExpenses;

                    return response;
                }).ToList();
                return projectDetails;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<List<ProjectMasterResponse>> GetAllActiveOfBuilderProjectAsync(int builderId)
        {
            try
            {
                var projects = await _context.ProjectMasters.Include(x => x.BuilderMaster).Include(x => x.ProjectMilestones).ThenInclude(x => x.ProjectExpenses).Where(x => x.BuilderId == builderId).ToListAsync();
                var projectDetails = projects.Select(project =>
                {
                    var response = _mapper.Map<ProjectMasterResponse>(project);

                    // Compute total expenses from all milestones
                    var totalExpenses = project.ProjectMilestones
                        .SelectMany(m => m.ProjectExpenses)
                        .Sum(e => e.Amount);

                    response.TotalSpend = totalExpenses;

                    return response;
                }).ToList();
                return projectDetails;
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
                var projects = await _context.ProjectMasters.Include(x => x.BuilderMaster).Include(x => x.ProjectMilestones).ThenInclude(x => x.ProjectExpenses).FirstOrDefaultAsync(x => x.ProjectId == projectId);
                if (projects == null)
                    return null;

                var totalExpenses = projects.ProjectMilestones
                        .SelectMany(m => m.ProjectExpenses)
                        .Sum(e => e.Amount);

                var projectDetails = _mapper.Map<ProjectMasterResponse>(projects);
                projectDetails.TotalSpend = totalExpenses;
                return projectDetails;
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

                if (!string.IsNullOrWhiteSpace(request.ReraNumber))
                {
                    var reraNummber = await _context.ProjectMasters.FirstOrDefaultAsync(x => x.ReraNumber == request.ReraNumber && x.ProjectId != request.ProjectId);
                    if (reraNummber != null)
                    {
                        retValue.StatusCode = ResultCode.RecordNotFound;
                        retValue.ErrorMessage = "RERA number already registered";
                        return retValue;
                    }
                }

                if (request.ProjectId == 0)
                {
                    request.CreatedBy = username;
                    request.CreatedDate = CommonHelper.GetISTTime(DateTime.Now);
                    request.IsActive = true;
                    var project = _mapper.Map<ProjectMaster>(request);
                    _context.ProjectMasters.Add(project);
                    await _context.SaveChangesAsync();
                    retValue.StatusCode = ResultCode.SuccessfullyCreated;
                    retValue.ResponseMessage = "Proporty added successfully";
                }
                else
                {
                   var project = await _context.ProjectMasters.IgnoreQueryFilters().FirstOrDefaultAsync(x => x.ProjectId == request.ProjectId);
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
                        //if (project.ActualStartDate != request.ActualStartDate)
                        //    project.ActualStartDate = request.ActualStartDate;
                        //if (project.ActualCompletionDate != request.ActualCompletionDate)
                        //    project.ActualCompletionDate = request.ActualCompletionDate;
                        if (project.ProjectAddress != request.ProjectAddress)
                            project.ProjectAddress = request.ProjectAddress;
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
                        project.PropertyType = request.PropertyType;
                        project.Bedrooms = request.Bedrooms;
                        project.Bathrooms = request.Bathrooms;
                        project.AreaSqFt = request.AreaSqFt;
                        project.PricePerSqFt = request.PricePerSqFt;
                        project.PossessionStatus = request.PossessionStatus;
                        project.ApprovalType = request.ApprovalType;
                        project.HMDANumber = request.HMDANumber;
                        project.DTCPNumber = request.DTCPNumber;
                        project.City = request.City;
                        project.State = request.State;
                        project.Pincode = request.Pincode;
                        project.Amenities = request.Amenities;
                        project.IsFeatured = request.IsFeatured;
                        project.CarpetArea = request.CarpetArea;
                        project.SuperBuiltUpArea = request.SuperBuiltUpArea;
                        project.FurnishingStatus = request.FurnishingStatus;
                        project.FacingDirection = request.FacingDirection;
                        project.FloorNumber = request.FloorNumber;
                        project.TotalFloors = request.TotalFloors;
                        project.ParkingCount = request.ParkingCount;
                        project.ParkingType = request.ParkingType;
                        project.BalconyCount = request.BalconyCount;
                        project.TransactionType = request.TransactionType;
                        project.OwnershipType = request.OwnershipType;
                        project.MaintenanceCharges = request.MaintenanceCharges;
                        project.FloorPlanImage = request.FloorPlanImage;
                        project.VideoTourUrl = request.VideoTourUrl;
                        project.BrochureUrl = request.BrochureUrl;
                        project.PropertyAge = request.PropertyAge;
                        project.HasPowerBackup = request.HasPowerBackup;
                        project.HasWaterSupply = request.HasWaterSupply;
                        project.IsGatedCommunity = request.IsGatedCommunity;
                        project.Latitude = request.Latitude;
                        project.Longitude = request.Longitude;
                        project.Locality = request.Locality;
                        project.IsActive = request.IsActive;
                        project.ModifiedBy = username;
                        project.ModifiedDate = CommonHelper.GetISTTime(DateTime.Now);
                        _context.ProjectMasters.Update(project);
                        await _context.SaveChangesAsync();

                        retValue.StatusCode = ResultCode.SuccessfullyUpdated;
                        retValue.ResponseMessage = "Proporty updated successfully";
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

        public async Task<ResultModel> AddUpdateProjectDataFileAsync(ProjectDataPathRequest request, string userName)
        {
            ResultModel retValue = new ResultModel();
            try
            {
                var projectDetail = await _context.ProjectMasters.FirstOrDefaultAsync(x => x.ProjectId == request.ProjectId);
                if (projectDetail == null)
                {
                    retValue.StatusCode = ResultCode.RecordNotFound;
                    retValue.ErrorMessage = "Property not found";
                    return retValue;
                }
                if (request.ProjectDataPathId == 0)
                {
                    request.CreatedBy = userName;
                    request.CreatedDate = CommonHelper.GetISTTime(DateTime.Now);
                    request.IsActive = true;
                    var project = _mapper.Map<ProjectDataPath>(request);
                    _context.ProjectDataPaths.Add(project);
                    await _context.SaveChangesAsync();
                    retValue.StatusCode = ResultCode.SuccessfullyCreated;
                    retValue.ResponseMessage = "Proporty data added successfully";
                }
                else
                {
                    var projectData = await _context.ProjectDataPaths.FirstOrDefaultAsync(x => x.ProjectDataPathId == request.ProjectDataPathId);
                    if (projectData != null)
                    {

                        if (projectData.DataName != request.DataName)
                            projectData.DataName = request.DataName;
                        if (projectData.Category != request.Category)
                            projectData.Category = request.Category;
                        if (projectData.Path != request.Path)
                            projectData.Path = request.Path;
                        if (projectData.FileType != request.FileType)
                            projectData.FileType = request.FileType;
                        if (projectData.ProjectId != request.ProjectId)
                            projectData.ProjectId = request.ProjectId;
                        projectData.IsActive = request.IsActive;
                        projectData.ModifiedBy = userName;
                        projectData.ModifiedDate = CommonHelper.GetISTTime(DateTime.Now);
                        _context.ProjectDataPaths.Update(projectData);
                        await _context.SaveChangesAsync();

                        retValue.StatusCode = ResultCode.SuccessfullyUpdated;
                        retValue.ResponseMessage = "Proporty data updated successfully";
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

        public async Task<List<ProjectDataPathResponse>> GetAllProjectDataDetailAsync()
        {
            try
            {
                var projectData = await _context.ProjectDataPaths.IgnoreQueryFilters().Include(x => x.ProjectMaster).ToListAsync();
                return _mapper.Map<List<ProjectDataPathResponse>>(projectData);
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<List<ProjectDataPathResponse>> GetAllActiveProjectDataDetailAsync()
        {
            try
            {
                var projectData = await _context.ProjectDataPaths.Include(x => x.ProjectMaster).ToListAsync();
                return _mapper.Map<List<ProjectDataPathResponse>>(projectData);
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<ProjectDataPathResponse> GetProjectDataDetailByIdAsync(int projectDataPathId)
        {
            try
            {
                var projectData = await _context.ProjectDataPaths.Include(x => x.ProjectMaster).FirstOrDefaultAsync(x => x.ProjectDataPathId == projectDataPathId);
                return _mapper.Map<ProjectDataPathResponse>(projectData);
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<List<ProjectDataPathResponse>> GetProjectDataDetailByProjectIdAsync(int projectId)
        {
            try
            {
                var projectData = await _context.ProjectDataPaths.Include(x => x.ProjectMaster).Where(x => x.ProjectId == projectId).ToListAsync();
                return _mapper.Map<List<ProjectDataPathResponse>>(projectData);
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
