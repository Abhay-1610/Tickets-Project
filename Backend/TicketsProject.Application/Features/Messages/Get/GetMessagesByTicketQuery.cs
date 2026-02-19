using MediatR;
using TicketsProject.Application.DTOs.Messages;
using System.Collections.Generic;

namespace TicketsProject.Application.Features.Messages.Get
{
    public sealed class GetMessagesByTicketQuery
        : IRequest<List<TicketMessageDto>>
    {
        public int TicketId { get; }

        public GetMessagesByTicketQuery(int ticketId)
        {
            TicketId = ticketId;
        }
    }
}
