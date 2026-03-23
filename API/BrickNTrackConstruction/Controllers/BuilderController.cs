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
    [Authorize]
    public class BuilderController : ControllerBase
    {
        private readonly IBuilderService _builderService;

        public BuilderController(IBuilderService builderService)
        {
            _builderService = builderService;
        }

        [HttpPost("addUpdateBuilder")]
        [Authorize(Roles = Roles.AdminOrBuilder)]
        public async Task<ActionResult<ServiceResult>> AddUpdateBuilder([FromBody] BuilderMasterRequest request)
        {
            var userName = User.FindFirst(ClaimTypes.Name)?.Value!;
            var result = await _builderService.AddUpdateBuilderAsync(request, userName);
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("getAllBuilder")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<ActionResult<ServiceResult<List<BuilderMasterResponse>>>> GetAllBuilder()
        {
            var result = await _builderService.GetAllBuilderAsync();
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("getAllActiveBuilder")]
        [AllowAnonymous]
        public async Task<ActionResult<ServiceResult<List<BuilderMasterResponse>>>> GetAllActiveBuilder()
        {
            var result = await _builderService.GetAllActiveBuilderAsync();
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("getBuilderById")]
        [AllowAnonymous]
        public async Task<ActionResult<ServiceResult<BuilderMasterResponse>>> GetBuilderById([FromQuery] int builderId)
        {
            var result = await _builderService.GetBuilderByIdAsync(builderId);
            return StatusCode(result.StatusCode, result);
        }

        [HttpPut("verifyBuilder")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<ActionResult<ServiceResult>> VerifyBuilder([FromQuery] int builderId, [FromQuery] bool verified = true)
        {
            var result = await _builderService.SetBuilderVerifiedAsync(builderId, verified);
            return StatusCode(result.StatusCode, result);
        }

        [HttpDelete("deleteBuilder")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<ActionResult<ServiceResult>> DeleteBuilder([FromQuery] int builderId)
        {
            var userName = User.FindFirst(ClaimTypes.Name)?.Value!;
            var result = await _builderService.SoftDeleteBuilderAsync(builderId, userName);
            return StatusCode(result.StatusCode, result);
        }
    }
}
