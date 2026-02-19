using MediatR;
using TicketsProject.Application.DTOs.Tickets;

namespace TicketsProject.Application.Features.Tickets.Get
{
    public sealed class GetTicketDetailQuery : IRequest<TicketDetailDto>
    {
        public int TicketId { get; }

        public GetTicketDetailQuery(int ticketId)
        {
            TicketId = ticketId;
        }
    }
}
