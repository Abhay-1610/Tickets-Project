using MediatR;
using TicketsProject.Application.Interfaces;
using TicketsProject.Application.DTOs.Tickets;
using TicketsProject.Application.Common;

namespace TicketsProject.Application.Features.Tickets.Get
{
    public sealed class GetMyTicketsQueryHandler
        : IRequestHandler<GetMyTicketsQuery, List<TicketListDto>>
    {
        private readonly ITicketRepository _ticketRepository;
        private readonly ICurrentUserService _currentUser;

        public GetMyTicketsQueryHandler(
            ITicketRepository ticketRepository,
            ICurrentUserService currentUser)
        {
            _ticketRepository = ticketRepository;
            _currentUser = currentUser;
        }

        public async Task<List<TicketListDto>> Handle(
            GetMyTicketsQuery request,
            CancellationToken cancellationToken)
        {
            // RULE: only customer can call this
            if (_currentUser.Role != RoleConstants.Customer)
                throw new UnauthorizedAccessException();
            return await _ticketRepository.GetByCustomerIdAsync(_currentUser.UserId);
        }
    }
}
