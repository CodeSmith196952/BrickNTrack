using BrickNTrack.Doman.Model;
using BrickNTrack.Repository.Interface;
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
                var (token, refreshToken) = await _userManager.LoginAsync(request);
                return Ok(new { token, refreshToken });
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

    }
}
