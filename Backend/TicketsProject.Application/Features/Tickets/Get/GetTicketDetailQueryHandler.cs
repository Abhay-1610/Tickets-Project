using MediatR;
using TicketsProject.Application.Common;
using TicketsProject.Application.DTOs.Tickets;
using TicketsProject.Application.Interfaces;

namespace TicketsProject.Application.Features.Tickets.Get
{
    public sealed class GetTicketDetailQueryHandler
        : IRequestHandler<GetTicketDetailQuery, TicketDetailDto>
    {
        private readonly ITicketRepository _ticketRepository;
        private readonly ICurrentUserService _currentUser;


        public GetTicketDetailQueryHandler(ITicketRepository ticketRepository, ICurrentUserService currentUser)
        {
            _ticketRepository = ticketRepository;
            _currentUser = currentUser;
        }

        public async Task<TicketDetailDto> Handle(
            GetTicketDetailQuery request,
            CancellationToken cancellationToken)
        {
            var ticket = await _ticketRepository.GetByIdAsync(request.TicketId)
                          ?? throw new KeyNotFoundException("Ticket not found");

            if (_currentUser.Role == RoleConstants.Customer && ticket.CustomerId != _currentUser.UserId)
                throw new UnauthorizedAccessException();


            return await _ticketRepository.GetDetailAsync(request.TicketId) 
                ?? throw new KeyNotFoundException("Ticket not found"); ;
        }
    }
}
