using Microsoft.AspNetCore.SignalR;
using TicketsProject.Application.Interfaces;

namespace TicketsProject.Infrastructure.SignalR
{
    public sealed class SignalRNotifier : IRealtimeNotifier
    {
        private readonly IHubContext<TicketHub> _hubContext;

        public SignalRNotifier(IHubContext<TicketHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task NotifyTicketAsync( int ticketId, string eventName,object data)
        {
            await _hubContext.Clients.Group(ticketId.ToString()).SendAsync(eventName, data);
        }
    }
}
