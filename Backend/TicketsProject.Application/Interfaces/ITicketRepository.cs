using TicketsProject.Application.DTOs.Tickets;
using TicketsProject.Domain.Entities;
using TicketsProject.Domain.Enums;

public interface ITicketRepository
{
    Task<int> CreateAsync(Ticket ticket);

    Task<Ticket?> GetByIdAsync(int ticketId);

    Task<List<TicketListDto>> GetByCustomerIdAsync(string customerId);

    Task<List<TicketListDto>> GetAllAsync();

    Task<TicketDetailDto?> GetDetailAsync(int ticketId);

    Task AssignAgentAsync(TicketAgent agent);

    Task UpdateStatusAsync(int ticketId, TicketStatus status);

    Task UpdateAsync(Ticket ticket);

    Task<bool> IsAgentAssignedAsync(int ticketId, string agentId);


}
