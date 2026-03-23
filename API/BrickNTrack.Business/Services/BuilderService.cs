using BrickNTrack.Domain.CommonModel;
using BrickNTrack.Domain.Model;
using BrickNTrack.Repository.Context;
using BrickNTrack.Repository.Interface;
using Microsoft.EntityFrameworkCore;

namespace BrickNTrack.Business.Services
{
    public class BuilderService : IBuilderService
    {
        private readonly IBuilder _builder;
        private readonly BrickNTrackContext _context;

        public BuilderService(IBuilder builder, BrickNTrackContext context)
        {
            _builder = builder;
            _context = context;
        }

        public async Task<ServiceResult<List<BuilderMasterResponse>>> GetAllBuilderAsync()
        {
            var result = await _builder.GetAllBuilderAsync();
            return ServiceResult<List<BuilderMasterResponse>>.Ok(result ?? new List<BuilderMasterResponse>());
        }

        public async Task<ServiceResult<List<BuilderMasterResponse>>> GetAllActiveBuilderAsync()
        {
            var result = await _builder.GetAllActiveBuilderAsync();
            return ServiceResult<List<BuilderMasterResponse>>.Ok(result ?? new List<BuilderMasterResponse>());
        }

        public async Task<ServiceResult<BuilderMasterResponse>> GetBuilderByIdAsync(int builderId)
        {
            var result = await _builder.GetBuilderByIdAsync(builderId);
            if (result == null)
                return ServiceResult<BuilderMasterResponse>.NotFound("Builder not found");
            return ServiceResult<BuilderMasterResponse>.Ok(result);
        }

        public async Task<ServiceResult> AddUpdateBuilderAsync(BuilderMasterRequest request, string username)
        {
            var result = await _builder.AddUpdateBuilderAsync(request, username);

            if (result.StatusCode == ApplicationConstant.ResultCode.SuccessfullyCreated)
                return ServiceResult.Created(result.ResponseMessage);
            if (result.StatusCode == ApplicationConstant.ResultCode.SuccessfullyUpdated)
                return ServiceResult.Ok(result.ResponseMessage);
            if (result.StatusCode == ApplicationConstant.ResultCode.DuplicateRecord)
                return ServiceResult.Conflict(result.ErrorMessage);
            if (result.StatusCode == ApplicationConstant.ResultCode.RecordNotFound)
                return ServiceResult.NotFound(result.ErrorMessage);

            return ServiceResult.Fail(result.ErrorMessage ?? "Operation failed");
        }

        public async Task<ServiceResult> SoftDeleteBuilderAsync(int builderId, string username)
        {
            var builder = await _builder.GetBuilderByIdAsync(builderId);
            if (builder == null)
                return ServiceResult.NotFound("Builder not found");

            var request = new BuilderMasterRequest
            {
                BuilderId = builderId,
                Name = builder.Name,
                TagLine = builder.TagLine,
                Description = builder.Description,
                OfficeAddress = builder.OfficeAddress,
                LangLog = builder.LangLog,
                EmailAddress = builder.EmailAddress,
                Contact1 = builder.Contact1,
                Contact2 = builder.Contact2,
                GSTNo = builder.GSTNo,
                OwnerName = builder.OwnerName,
                IsActive = false
            };
            var result = await _builder.AddUpdateBuilderAsync(request, username);
            return result.StatusCode == ApplicationConstant.ResultCode.SuccessfullyUpdated
                ? ServiceResult.Ok("Builder deleted successfully")
                : ServiceResult.Fail("Failed to delete builder");
        }

        public async Task<ServiceResult> SetBuilderVerifiedAsync(int builderId, bool verified)
        {
            var builder = await _context.BuilderMasters.FirstOrDefaultAsync(b => b.BuilderId == builderId);
            if (builder == null)
                return ServiceResult.NotFound("Builder not found");

            builder.IsVerified = verified;
            _context.BuilderMasters.Update(builder);
            await _context.SaveChangesAsync();

            return ServiceResult.Ok(verified ? "Builder verified successfully" : "Builder verification removed");
        }
    }
}
