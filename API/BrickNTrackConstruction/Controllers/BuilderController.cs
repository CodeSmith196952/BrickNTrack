using BrickNTrack.Doman.Model;
using BrickNTrack.Repository.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using static BrickNTrack.Doman.CommonModel.ApplicationConstant;

namespace BrickNTrackConstruction.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class BuilderController : ControllerBase
    {
        private readonly IBuilder _builder;

        public BuilderController(IBuilder builder)
        {
            _builder = builder;
        }

        [Route("addUpdateBuilder")]
        [HttpPost]
        public async Task<IActionResult> AddUpdateBuilderAsync([FromBody] BuilderMasterRequest request)
        {
            var userName = User.FindFirst(ClaimTypes.Name)?.Value;
            var result = await _builder.AddUpdateBuilderAsync(request, userName);
            if (result.StatusCode == ResultCode.SuccessfullyCreated || result.StatusCode == ResultCode.SuccessfullyUpdated)
                return Ok(result);
            else
                return NotFound(result);
        }

        [Route("setAllBuilder")]
        [HttpGet]
        public async Task<List<BuilderMasterResponse>> GetAllBuilderAsync()
        {
            var result = await _builder.GetAllBuilderAsync();
            return result;
        }

        [Route("getAllActiveBuilder")]
        [HttpGet]
        public async Task<List<BuilderMasterResponse>> GetAllActiveBuilderAsync()
        {
            var result = await _builder.GetAllActiveBuilderAsync();
            return result;
        }

        [Route("getBuilderById")]
        [HttpGet]
        public async Task<BuilderMasterResponse> GetBuilderByIdAsync([FromQuery] int builderId)
        {
            var result = await _builder.GetBuilderByIdAsync(builderId);
            return result;
        }
    }
}
