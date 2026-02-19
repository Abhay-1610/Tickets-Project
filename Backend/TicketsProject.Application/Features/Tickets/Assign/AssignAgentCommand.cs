using MediatR;

namespace TicketsProject.Application.Features.Tickets.Assign
{
    public sealed class AssignAgentCommand : IRequest
    {
        public int TicketId { get; }

        public AssignAgentCommand(int ticketId)
        {
            TicketId = ticketId;
        }
    }
}
