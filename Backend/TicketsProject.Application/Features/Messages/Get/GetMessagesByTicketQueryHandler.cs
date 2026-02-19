using MediatR;
using TicketsProject.Application.Common;
using TicketsProject.Application.DTOs.Messages;
using TicketsProject.Application.Interfaces;

namespace TicketsProject.Application.Features.Messages.Get
{
    public sealed class GetMessagesByTicketQueryHandler
        : IRequestHandler<GetMessagesByTicketQuery, List<TicketMessageDto>>
    {
        private readonly IMessageRepository _messageRepository;
        private readonly ITicketRepository _ticketRepository;
        private readonly ICurrentUserService _currentUser;

        public GetMessagesByTicketQueryHandler(
            IMessageRepository messageRepository,
            ITicketRepository ticketRepository,
            ICurrentUserService currentUser)
        {
            _messageRepository = messageRepository;
            _ticketRepository = ticketRepository;
            _currentUser = currentUser;
        }

        public async Task<List<TicketMessageDto>> Handle(
            GetMessagesByTicketQuery request,
            CancellationToken cancellationToken)
        {
            var ticket = await _ticketRepository.GetByIdAsync(request.TicketId)
    ?? throw new KeyNotFoundException("Ticket not found");

            // customer rule
            if (_currentUser.Role == RoleConstants.Customer &&
                ticket.CustomerId != _currentUser.UserId)
                throw new UnauthorizedAccessException();

            // agent rule
            if (_currentUser.Role == RoleConstants.Agent)
            {
                var isAssigned = await _ticketRepository.IsAgentAssignedAsync(
                    ticket.Id,
                    _currentUser.UserId);

                if (!isAssigned)
                    throw new UnauthorizedAccessException();
            }

            // admin passes automatically


            return await _messageRepository.GetByTicketDtoAsync(request.TicketId);
        }
    }
}
