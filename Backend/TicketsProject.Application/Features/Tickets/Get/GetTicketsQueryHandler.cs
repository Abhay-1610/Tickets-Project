using MediatR;
using TicketsProject.Application.Common;
using TicketsProject.Application.DTOs.Tickets;
using TicketsProject.Application.Interfaces;

namespace TicketsProject.Application.Features.Tickets.Get
{
    public sealed class GetTicketsQueryHandler
        : IRequestHandler<GetTicketsQuery, List<TicketListDto>>
    {
        private readonly ITicketRepository _ticketRepository;
        private readonly ICurrentUserService _currentUser;


        public GetTicketsQueryHandler(ITicketRepository ticketRepository, ICurrentUserService currentUser)
        {
            _ticketRepository = ticketRepository;
            _currentUser = currentUser;
        }

        public async Task<List<TicketListDto>> Handle(
            GetTicketsQuery request,
            CancellationToken cancellationToken)
        {
            if (_currentUser.Role != RoleConstants.Agent &&  _currentUser.Role != RoleConstants.Admin)
                throw new UnauthorizedAccessException();


            return await _ticketRepository.GetAllAsync();
        }
    }
}
