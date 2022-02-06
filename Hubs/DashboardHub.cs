using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using RealTime.Controllers;

namespace RealTime.Hubs
{
    public class DashboardHub : Hub
    {
        public async Task Send(Payload payload)
        {
            await Clients.All.SendAsync("dashboardData", payload);
        }
    }
}