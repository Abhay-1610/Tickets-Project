using MediatR;

namespace TicketsProject.Application.Features.Tickets.ConfirmResolution
{
    public sealed class ConfirmTicketResolutionCommand : IRequest
    {
        public int TicketId { get; }
        public bool IsResolved { get; }

        public ConfirmTicketResolutionCommand(int ticketId, bool isResolved)
        {
            TicketId = ticketId;
            IsResolved = isResolved;
        }
    }
}
