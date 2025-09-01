using BrickNTrack.Doman.CommonModel;
using BrickNTrack.Doman.Model;

namespace BrickNTrack.Repository.Interface
{
    public interface IUserManager
    {
        Task<UserTokenDto> LoginAsync(LoginRequestDTO request);
        Task<RefreshResponseDTO> RefreshTokenAsync(RefreshRequestDTO request);
        Task<ResultModel> RegistereUserAsync(UserManagerRequest request);
        Task<UserManagerResponse> GetUserDetailByIdAsync(int userId);
        Task<List<UserManagerResponse>> GetAllUserDetailAsync();
        Task<List<UserManagerResponse>> GetAllActiveUserDetailAsync();
        Task<List<UserManagerResponse>> GetAllUserDetailOfBuilderAsync(int builderId);
        Task<List<UserManagerResponse>> GetAllActiveUserDetailOfBuilderAsync(int builderId);
    }
}
