using BrickNTrack.Domain.CommonModel;
using BrickNTrack.Domain.Model;
using BrickNTrack.Repository.Interface;

namespace BrickNTrack.Business.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserManager _userManager;

        public AuthService(IUserManager userManager)
        {
            _userManager = userManager;
        }

        public async Task<ServiceResult<UserTokenDto>> LoginAsync(LoginRequestDTO request)
        {
            try
            {
                var result = await _userManager.LoginAsync(request);
                return ServiceResult<UserTokenDto>.Ok(result);
            }
            catch (UnauthorizedAccessException)
            {
                return ServiceResult<UserTokenDto>.Unauthorized("Invalid credentials");
            }
        }

        public async Task<ServiceResult<RefreshResponseDTO>> RefreshTokenAsync(RefreshRequestDTO request)
        {
            try
            {
                var result = await _userManager.RefreshTokenAsync(request);
                return ServiceResult<RefreshResponseDTO>.Ok(result);
            }
            catch (UnauthorizedAccessException)
            {
                return ServiceResult<RefreshResponseDTO>.Unauthorized("Invalid refresh token");
            }
        }

        public async Task<ServiceResult> RegisterUserAsync(UserManagerRequest request, string userName)
        {
            request.CreatedDate = DateTime.Now;
            request.CreatedBy = userName;
            var result = await _userManager.RegistereUserAsync(request);

            if (result.StatusCode == ApplicationConstant.ResultCode.SuccessfullyCreated)
                return ServiceResult.Created(result.ResponseMessage);
            if (result.StatusCode == ApplicationConstant.ResultCode.SuccessfullyUpdated)
                return ServiceResult.Ok(result.ResponseMessage);
            if (result.StatusCode == ApplicationConstant.ResultCode.DuplicateRecord)
                return ServiceResult.Conflict(result.ErrorMessage);

            return ServiceResult.Fail(result.ErrorMessage ?? "Operation failed");
        }

        public async Task<ServiceResult<UserManagerResponse>> GetUserDetailByIdAsync(int userId)
        {
            var result = await _userManager.GetUserDetailByIdAsync(userId);
            if (result == null)
                return ServiceResult<UserManagerResponse>.NotFound("User not found");
            return ServiceResult<UserManagerResponse>.Ok(result);
        }

        public async Task<ServiceResult<List<UserManagerResponse>>> GetAllUserDetailAsync()
        {
            var result = await _userManager.GetAllUserDetailAsync();
            return ServiceResult<List<UserManagerResponse>>.Ok(result ?? new List<UserManagerResponse>());
        }

        public async Task<ServiceResult<List<UserManagerResponse>>> GetAllActiveUserDetailAsync()
        {
            var result = await _userManager.GetAllActiveUserDetailAsync();
            return ServiceResult<List<UserManagerResponse>>.Ok(result ?? new List<UserManagerResponse>());
        }

        public async Task<ServiceResult<List<UserManagerResponse>>> GetAllUserDetailOfBuilderAsync(int builderId)
        {
            var result = await _userManager.GetAllUserDetailOfBuilderAsync(builderId);
            return ServiceResult<List<UserManagerResponse>>.Ok(result ?? new List<UserManagerResponse>());
        }

        public async Task<ServiceResult<List<UserManagerResponse>>> GetAllActiveUserDetailOfBuilderAsync(int builderId)
        {
            var result = await _userManager.GetAllActiveUserDetailOfBuilderAsync(builderId);
            return ServiceResult<List<UserManagerResponse>>.Ok(result ?? new List<UserManagerResponse>());
        }
    }
}
