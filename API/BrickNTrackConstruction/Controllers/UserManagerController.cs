using BrickNTrack.Doman.Model;
using BrickNTrack.Repository.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BrickNTrackConstruction.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserManagerController : ControllerBase
    {
        private readonly IUserManager _userManager; 
        public UserManagerController(IUserManager userManager) 
        {
            _userManager = userManager;
        }

        [Route("login")]
        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginRequestDTO request)
        {
            try
            {
                var result = await _userManager.LoginAsync(request);
                return Ok(result);
            }
            catch (UnauthorizedAccessException e)
            {
                return Unauthorized(e.Message);
            }
        }

        [HttpPost("AddUser")]
        public async Task<IActionResult> RegisterUser([FromBody] UserManagerRequest request)
        {
            var userId = User.FindFirst("UserId")?.Value;
            var userName = User.FindFirst(ClaimTypes.Name)?.Value;
            request.CreatedDate = DateTime.Now;
            request.CreatedBy = userName;
            var result = await _userManager.RegistereUserAsync(request);
            return Ok(result);
        }

        [Authorize]
        [HttpGet("getAllActiveUserDetail")]
        public async Task<List<UserManagerResponse>> GetAllActiveUserDetailAsyncfdd()
        {
            return await _userManager.GetAllActiveUserDetailAsync();
        }

        [Authorize]
        [HttpGet("getAllUserDetail")]
        public async Task<List<UserManagerResponse>> GetAllUserDetailAsync()
        {
            return await _userManager.GetAllUserDetailAsync();
        }

        [Authorize]
        [HttpGet("getUserDetailById")]
        public async Task<UserManagerResponse> GetUserDetailByIdAsync([FromQuery] int userId)
        {
            return await _userManager.GetUserDetailByIdAsync(userId);
        }

        [HttpPost("RefreshToken")]
        public async Task<IActionResult> RefreshTokenAsync([FromQuery] RefreshRequestDTO request)
        {
            var result = await _userManager.RefreshTokenAsync(request);
            return Ok(result);
        }

    }
}
