using BrickNTrack.Domain.CommonModel;
using BrickNTrack.Domain.Model;

namespace BrickNTrack.Business.Services
{
    public interface IBuilderService
    {
        Task<ServiceResult<List<BuilderMasterResponse>>> GetAllBuilderAsync();
        Task<ServiceResult<List<BuilderMasterResponse>>> GetAllActiveBuilderAsync();
        Task<ServiceResult<BuilderMasterResponse>> GetBuilderByIdAsync(int builderId);
        Task<ServiceResult> AddUpdateBuilderAsync(BuilderMasterRequest request, string username);
        Task<ServiceResult> SoftDeleteBuilderAsync(int builderId, string username);
        Task<ServiceResult> SetBuilderVerifiedAsync(int builderId, bool verified);
    }
}
