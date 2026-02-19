using MediatR;
using TicketsProject.Application.Common;
using TicketsProject.Application.Features.Messages.System;
using TicketsProject.Application.Interfaces;
using TicketsProject.Domain.Enums;

namespace TicketsProject.Application.Features.Tickets.RequestConfirmation
{
    public sealed class RequestTicketConfirmationCommandHandler
        : IRequestHandler<RequestTicketConfirmationCommand>
    {
        private readonly ITicketRepository _ticketRepository;
        private readonly IMediator _mediator;
        private readonly ICurrentUserService _currentUser;

        public RequestTicketConfirmationCommandHandler(
            ITicketRepository ticketRepository,
            IMediator mediator,
            ICurrentUserService currentUser)
        {
            _ticketRepository = ticketRepository;
            _mediator = mediator;
            _currentUser = currentUser;
        }

        public async Task Handle(
            RequestTicketConfirmationCommand request,
            CancellationToken cancellationToken)
        {
            // only agent can request confirmation
            if (_currentUser.Role != RoleConstants.Agent)
                throw new UnauthorizedAccessException();

            var ticket = await _ticketRepository.GetByIdAsync(request.TicketId)
                ?? throw new KeyNotFoundException("Ticket not found");

            if (ticket.Status != TicketStatus.InProgress)
                throw new InvalidOperationException(
                    "Ticket must be In Progress to request confirmation");

            // =========================
            // SYSTEM MESSAGE (FIXED)
            // =========================
            await _mediator.Send(
                new CreateSystemMessageCommand(
                    ticket.Id,
                    $"{_currentUser.Email} requested confirmation",
                    SystemMessageType.RequestConfirmation
                ),
                cancellationToken);
        }
    }
}
