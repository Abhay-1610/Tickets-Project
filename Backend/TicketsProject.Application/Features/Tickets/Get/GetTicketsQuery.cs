using MediatR;
using TicketsProject.Application.DTOs.Tickets;
using System.Collections.Generic;

namespace TicketsProject.Application.Features.Tickets.Get
{
    public sealed class GetTicketsQuery : IRequest<List<TicketListDto>>
    {
    }
}
