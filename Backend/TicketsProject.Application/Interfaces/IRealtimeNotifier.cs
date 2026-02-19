namespace TicketsProject.Application.Interfaces
{
    public interface IRealtimeNotifier
    {
        // notify all users in a ticket
        Task NotifyTicketAsync(int ticketId,string eventName,object data);
    }
}
