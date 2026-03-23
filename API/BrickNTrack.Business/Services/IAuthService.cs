using BrickNTrack.Domain.CommonModel;
using BrickNTrack.Domain.Model;

namespace BrickNTrack.Business.Services
{
    public interface IAuthService
    {
        Task<ServiceResult<UserTokenDto>> LoginAsync(LoginRequestDTO request);
        Task<ServiceResult<RefreshResponseDTO>> RefreshTokenAsync(RefreshRequestDTO request);
        Task<ServiceResult> RegisterUserAsync(UserManagerRequest request, string userName);
        Task<ServiceResult<UserManagerResponse>> GetUserDetailByIdAsync(int userId);
        Task<ServiceResult<List<UserManagerResponse>>> GetAllUserDetailAsync();
        Task<ServiceResult<List<UserManagerResponse>>> GetAllActiveUserDetailAsync();
        Task<ServiceResult<List<UserManagerResponse>>> GetAllUserDetailOfBuilderAsync(int builderId);
        Task<ServiceResult<List<UserManagerResponse>>> GetAllActiveUserDetailOfBuilderAsync(int builderId);
    }
}
