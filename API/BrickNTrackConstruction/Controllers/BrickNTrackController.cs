using Microsoft.AspNetCore.Mvc;

namespace BrickNTrackConstruction.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BrickNTrackController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            //Logger.Debug("Welcome to Kemar BrickNTrack -API is running");
            return Ok("Welcome to Kemar BrickNTrack -API is running");

        }
    }
}
