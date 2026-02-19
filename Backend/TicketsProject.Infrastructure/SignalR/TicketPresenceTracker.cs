using System.Collections.Generic;

namespace TicketsProject.Infrastructure.SignalR
{
    // ticketId -> list of online userIds
    public static class TicketPresenceTracker
    {
        private static Dictionary<int, List<string>> _onlineUsers = new Dictionary<int, List<string>>();

        public static List<string> UserJoined(int ticketId, string userId)
        {
            if (!_onlineUsers.ContainsKey(ticketId))
            {
                _onlineUsers[ticketId] = new List<string>();
            }

            if (!_onlineUsers[ticketId].Contains(userId))
            {
                _onlineUsers[ticketId].Add(userId);
            }

            return _onlineUsers[ticketId];
        }

        public static List<string> UserLeft(int ticketId, string userId)
        {
            if (_onlineUsers.ContainsKey(ticketId))
            {
                _onlineUsers[ticketId].Remove(userId);
            }

            return _onlineUsers.ContainsKey(ticketId) ? _onlineUsers[ticketId] : new List<string>();
        }
    }
}
