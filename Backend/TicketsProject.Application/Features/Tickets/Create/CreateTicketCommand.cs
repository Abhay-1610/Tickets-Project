using MediatR;
using TicketsProject.Application.DTOs.Tickets;

namespace TicketsProject.Application.Features.Tickets.Create
{
    public sealed class CreateTicketCommand : IRequest<int>
    {
        public CreateTicketDto Ticket { get; }

        public CreateTicketCommand(CreateTicketDto ticket)
        {
            Ticket = ticket;
        }
    }
}
