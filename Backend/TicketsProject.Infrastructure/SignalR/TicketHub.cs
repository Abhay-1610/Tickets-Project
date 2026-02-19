using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace TicketsProject.Infrastructure.SignalR
{
    public class TicketHub : Hub
    {
        // user opens ticket page
        public async Task JoinTicket(int ticketId)
        {
            var userId =  Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId)) return;

            // join signalr group
            await Groups.AddToGroupAsync(Context.ConnectionId, ticketId.ToString());

            // track presence
            var onlineUsers = TicketPresenceTracker.UserJoined(ticketId, userId);

            // notify everyone in ticket
            await Clients.Group(ticketId.ToString()).SendAsync("UserPresenceChanged", onlineUsers);
        }

        // user leaves ticket page
        public async Task LeaveTicket(int ticketId)
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId)) return;

            await Groups.RemoveFromGroupAsync(Context.ConnectionId,ticketId.ToString());

            var onlineUsers = TicketPresenceTracker.UserLeft(ticketId, userId);

            await Clients.Group(ticketId.ToString()).SendAsync("UserPresenceChanged", onlineUsers);
        }
    }
}
