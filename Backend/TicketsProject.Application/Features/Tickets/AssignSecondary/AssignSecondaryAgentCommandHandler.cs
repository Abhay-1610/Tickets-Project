using MediatR;
using TicketsProject.Application.Common;
using TicketsProject.Application.Features.Messages.System;
using TicketsProject.Application.Interfaces;
using TicketsProject.Domain.Entities;
using TicketsProject.Domain.Enums;

namespace TicketsProject.Application.Features.Tickets.AssignSecondary
{
    public sealed class AssignSecondaryAgentCommandHandler
        : IRequestHandler<AssignSecondaryAgentCommand>
    {
        private readonly ITicketRepository _ticketRepository;
        private readonly IAuditLogRepository _auditLogRepository;
        private readonly ICurrentUserService _currentUser;
        private readonly IMediator _mediator;

        public AssignSecondaryAgentCommandHandler(
            ITicketRepository ticketRepository,
            IAuditLogRepository auditLogRepository,
            ICurrentUserService currentUser,
            IMediator mediator)
        {
            _ticketRepository = ticketRepository;
            _auditLogRepository = auditLogRepository;
            _currentUser = currentUser;
            _mediator = mediator;
        }

        public async Task Handle(
            AssignSecondaryAgentCommand request,
            CancellationToken cancellationToken)
        {
            // ADMIN ONLY
            if (_currentUser.Role != RoleConstants.Admin)
                throw new UnauthorizedAccessException();

            var ticket = await _ticketRepository.GetByIdAsync(request.TicketId)
                ?? throw new KeyNotFoundException("Ticket not found");

            // must be in progress
            if (ticket.Status != TicketStatus.InProgress)
                throw new InvalidOperationException("Ticket must be In Progress");

            // already assigned?
            if (await _ticketRepository.IsAgentAssignedAsync(
                request.TicketId, request.AgentId))
                throw new InvalidOperationException("Agent already assigned");

            var agent = new TicketAgent
            {
                TicketId = request.TicketId,
                AgentId = request.AgentId,
                IsPrimary = false,
                AssignedAt = DateTime.UtcNow
            };

            await _ticketRepository.AssignAgentAsync(agent);

            // SYSTEM MESSAGE
            await _mediator.Send(
                new CreateSystemMessageCommand(
                    ticket.Id,
                    $"{_currentUser.Email} added an agent to the ticket",
                    SystemMessageType.AgentAssigned),
                cancellationToken);

            // AUDIT LOG
            await _auditLogRepository.AddAsync(new AuditLog
            {
                UserId = _currentUser.UserId,
                UserRole = _currentUser.Role,
                TicketId = ticket.Id,
                Action = "Admin added secondary agent",
                CreatedAt = DateTime.UtcNow
            });
        }
    }
}
