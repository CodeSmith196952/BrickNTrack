using BrickNTrack.Doman.CommonModel;
using BrickNTrack.Doman.Model;

namespace BrickNTrack.Repository.Interface
{
    public interface IUserManager
    {
        Task<(string token, string refreshToken)> LoginAsync(LoginRequestDTO request);
        Task<(string token, string refreshToken)> RefreshTokenAsync(RefreshRequestDTO request);
        Task<ResultModel> RegistereUserAsync(UserManagerRequest request);
    }
}
