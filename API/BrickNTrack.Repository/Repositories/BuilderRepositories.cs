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
    public class BuilderRepositories : BaseRepository<BuilderMaster>, IBuilder
    {
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;
        public BuilderRepositories(BrickNTrackContext context,
            IConfiguration configuration, IMapper mapper) : base(context)
        {
            _config = configuration;
            _mapper = mapper;
        }

        public async Task<List<BuilderMasterResponse>> GetAllBuilderAsync()
        {
            try
            {
                var buildersDetails = await _context.BuilderMasters.IgnoreQueryFilters().ToListAsync();
                return _mapper.Map<List<BuilderMasterResponse>>(buildersDetails);
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<List<BuilderMasterResponse>> GetAllActiveBuilderAsync()
        {
            try
            {
                var buildersDetails = await _context.BuilderMasters.ToListAsync();
                return _mapper.Map<List<BuilderMasterResponse>>(buildersDetails);
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<BuilderMasterResponse> GetBuilderByIdAsync(int builderId)
        {
            try
            {
                var buildersDetails = await _context.BuilderMasters.FirstOrDefaultAsync(x => x.BuilderId == builderId);
                return _mapper.Map<BuilderMasterResponse>(buildersDetails);
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<ResultModel> AddUpdateBuilderAsync(BuilderMasterRequest request, string username)
        {
            ResultModel retValue = new ResultModel();
            try
            {
                var duplicateGst = await _context.BuilderMasters.FirstOrDefaultAsync(x => x.BuilderId != request.BuilderId && x.GSTNo == request.GSTNo);
                if (duplicateGst != null)
                {
                    retValue.StatusCode = ResultCode.DuplicateRecord;
                    retValue.ErrorMessage = "GST numner is already registered";
                    return retValue;
                }

                if (request.BuilderId == 0)
                {
                    request.CreatedBy = username;
                    request.CreatedDate = CommonHelper.GetISTTime(DateTime.Now);
                    request.IsActive = true;
                    var builder = _mapper.Map<BuilderMaster>(request);
                    _context.BuilderMasters.Add(builder);
                    await _context.SaveChangesAsync();
                    retValue.StatusCode = ResultCode.SuccessfullyCreated;
                    retValue.ResponseMessage = "Builder added successfully";
                }
                else
                {
                    var builderDetail = await _context.BuilderMasters.FirstOrDefaultAsync(x => x.BuilderId == request.BuilderId);
                    if (builderDetail != null) 
                    {
                        if (!string.IsNullOrWhiteSpace(request.Name) && builderDetail.Name != request.Name)
                            builderDetail.Name = request.Name;
                        if ( builderDetail.Description != request.Description)
                            builderDetail.Description = request.Description;
                        if ( builderDetail.TagLine != request.TagLine)
                            builderDetail.TagLine = request.TagLine;
                        if (builderDetail.OfficeAddress != request.OfficeAddress)
                            builderDetail.OfficeAddress = request.OfficeAddress;
                        if ( builderDetail.LangLog != request.LangLog)
                            builderDetail.LangLog = request.LangLog;
                        if (builderDetail.EmailAddress != request.EmailAddress)
                            builderDetail.EmailAddress = request.EmailAddress;
                        if (builderDetail.Contact1 != request.Contact1)
                            builderDetail.Contact1 = request.Contact1;
                        if (builderDetail.Contact2 != request.Contact2)
                            builderDetail.Contact2 = request.Contact2;
                        if (builderDetail.GSTNo != request.GSTNo)
                            builderDetail.GSTNo = request.GSTNo;
                        if (builderDetail.OwnerName != request.OwnerName)
                            builderDetail.OwnerName = request.OwnerName;
                        builderDetail.IsActive = request.IsActive;
                        builderDetail.ModifiedBy = username;
                        builderDetail.ModifiedDate = CommonHelper.GetISTTime(DateTime.Now);

                        _context.BuilderMasters.Update(builderDetail);
                        await _context.SaveChangesAsync();
                        retValue.StatusCode = ResultCode.SuccessfullyUpdated;
                        retValue.ResponseMessage = "Builder updated successfully";
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
