using MediatR;
using TicketsProject.Domain.Enums;

namespace TicketsProject.Application.Features.Tickets.Status
{
    public sealed class UpdateTicketStatusCommand : IRequest
    {
        public int TicketId { get; }
        public TicketStatus Status { get; }

        public UpdateTicketStatusCommand(int ticketId, TicketStatus status)
        {
            TicketId = ticketId;
            Status = status;
        }
    }
}
