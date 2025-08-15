using BrickNTrack.Doman.Model;
using BrickNTrack.Repository.Interface;
using Microsoft.AspNetCore.Mvc;

namespace BrickNTrackConstruction.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PropertyController : ControllerBase
    {
        private readonly IProject _project;

        public PropertyController(IProject project)
        {
            _project = project;
        }

        [Route("getAllActiveProject")]
        [HttpGet]
        public async Task<List<ProjectMasterResponse>> GetAllActiveProjectAsync()
        {
            var result = await _project.GetAllActiveProjectAsync();
            return result;
        }
    }
}
