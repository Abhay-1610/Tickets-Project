using MediatR;

namespace TicketsProject.Application.Features.Tickets.RequestConfirmation
{
    public sealed record RequestTicketConfirmationCommand(int TicketId)
        : IRequest;
}
