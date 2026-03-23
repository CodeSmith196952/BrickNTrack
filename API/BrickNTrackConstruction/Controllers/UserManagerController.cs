using BrickNTrack.Business.Services;
using BrickNTrack.Domain.CommonModel;
using BrickNTrack.Domain.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BrickNTrackConstruction.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserManagerController : ControllerBase
    {
        private readonly IAuthService _authService;

        public UserManagerController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<ServiceResult<UserTokenDto>>> Login([FromBody] LoginRequestDTO request)
        {
            var result = await _authService.LoginAsync(request);
            return StatusCode(result.StatusCode, result);
        }

        [Authorize(Roles = Roles.Admin)]
        [HttpPost("AddUser")]
        public async Task<ActionResult<ServiceResult>> AddUser([FromBody] UserManagerRequest request)
        {
            var userName = User.FindFirst(ClaimTypes.Name)?.Value ?? "system";
            var result = await _authService.RegisterUserAsync(request, userName);
            return StatusCode(result.StatusCode, result);
        }

        [HttpPost("Register")]
        public async Task<ActionResult<ServiceResult>> Register([FromBody] UserManagerRequest request)
        {
            // Only allow self-registration as Buyer or Builder
            if (request.Role != Roles.Buyer && request.Role != Roles.Builder)
                return BadRequest(ServiceResult.Fail("Self-registration is only allowed for Buyer or Builder roles"));

            // Buyers don't belong to a builder
            if (request.BuilderId == 0)
                request.BuilderId = null;

            // Ensure new users are active
            request.IsActive = true;

            var result = await _authService.RegisterUserAsync(request, "self-registration");
            return StatusCode(result.StatusCode, result);
        }

        [Authorize(Roles = Roles.All)]
        [HttpGet("getAllActiveUserDetail")]
        public async Task<ActionResult<ServiceResult<List<UserManagerResponse>>>> GetAllActiveUserDetail()
        {
            var result = await _authService.GetAllActiveUserDetailAsync();
            return StatusCode(result.StatusCode, result);
        }

        [Authorize(Roles = Roles.AdminOrBuilder)]
        [HttpGet("getAllUserDetail")]
        public async Task<ActionResult<ServiceResult<List<UserManagerResponse>>>> GetAllUserDetail()
        {
            var result = await _authService.GetAllUserDetailAsync();
            return StatusCode(result.StatusCode, result);
        }

        [Authorize(Roles = Roles.All)]
        [HttpGet("getUserDetailById")]
        public async Task<ActionResult<ServiceResult<UserManagerResponse>>> GetUserDetailById([FromQuery] int userId)
        {
            var result = await _authService.GetUserDetailByIdAsync(userId);
            return StatusCode(result.StatusCode, result);
        }

        [HttpPost("RefreshToken")]
        public async Task<ActionResult<ServiceResult<RefreshResponseDTO>>> RefreshToken([FromBody] RefreshRequestDTO request)
        {
            var result = await _authService.RefreshTokenAsync(request);
            return StatusCode(result.StatusCode, result);
        }

        [Authorize(Roles = Roles.AdminOrBuilder)]
        [HttpGet("getAllActiveUserDetailOfBuilder")]
        public async Task<ActionResult<ServiceResult<List<UserManagerResponse>>>> GetAllActiveUserDetailOfBuilder()
        {
            var builderIdStr = User.FindFirst("BuilderId")?.Value;
            if (string.IsNullOrEmpty(builderIdStr) || !int.TryParse(builderIdStr, out var builderId) || builderId == 0)
                return BadRequest(ServiceResult.Fail("Builder ID not found in token"));
            var result = await _authService.GetAllActiveUserDetailOfBuilderAsync(builderId);
            return StatusCode(result.StatusCode, result);
        }

        [Authorize(Roles = Roles.AdminOrBuilder)]
        [HttpGet("getAllUserDetailOfBuilder")]
        public async Task<ActionResult<ServiceResult<List<UserManagerResponse>>>> GetAllUserDetailOfBuilder()
        {
            var builderIdStr = User.FindFirst("BuilderId")?.Value;
            if (string.IsNullOrEmpty(builderIdStr) || !int.TryParse(builderIdStr, out var builderId) || builderId == 0)
                return BadRequest(ServiceResult.Fail("Builder ID not found in token"));
            var result = await _authService.GetAllUserDetailOfBuilderAsync(builderId);
            return StatusCode(result.StatusCode, result);
        }
    }
}
