using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using RealTime.Hubs;

namespace RealTime.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly DashboardHub _dashboardHub;

        public DashboardController(DashboardHub dashboardHub)
        {
            _dashboardHub = dashboardHub;
        }

        [HttpPost]
        public async Task<ActionResult> PostDataToClient([FromBody] Payload payload)
        {
            await _dashboardHub.Send(payload);
            return Ok();
        }
    }

    public class Payload
    {
        public int FirstValue { get; set; }
        public int SecondValue { get; set; }
    }
}