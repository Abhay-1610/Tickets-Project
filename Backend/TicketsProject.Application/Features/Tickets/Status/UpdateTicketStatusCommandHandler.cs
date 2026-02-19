using MediatR;
using TicketsProject.Application.Common;
using TicketsProject.Application.Features.Messages.System;
using TicketsProject.Application.Interfaces;
using TicketsProject.Domain.Enums;
using TicketsProject.Domain.Entities;

namespace TicketsProject.Application.Features.Tickets.Status
{
    public sealed class UpdateTicketStatusCommandHandler
        : IRequestHandler<UpdateTicketStatusCommand>
    {
        private readonly ITicketRepository _ticketRepository;
        private readonly IAuditLogRepository _auditLogRepository;
        private readonly ICurrentUserService _currentUser;
        private readonly IMediator _mediator;

        public UpdateTicketStatusCommandHandler(
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
            UpdateTicketStatusCommand request,
            CancellationToken cancellationToken)
        {
            // only agent can update status
            if (_currentUser.Role != RoleConstants.Agent)
                throw new UnauthorizedAccessException();

            var ticket = await _ticketRepository.GetByIdAsync(request.TicketId)
                ?? throw new KeyNotFoundException("Ticket not found");

            // no updates after closed
            if (ticket.Status == TicketStatus.Closed)
                throw new InvalidOperationException("Ticket already closed");

            // closing requires customer confirmation
            if (request.Status == TicketStatus.Closed &&
                ticket.CustomerConfirmedResolution != true)
                throw new InvalidOperationException("Customer confirmation required");

            // update status
            ticket.Status = request.Status;

            // lifecycle timestamps
            if (request.Status == TicketStatus.InProgress &&
                ticket.InProgressAt == null)
            {
                ticket.InProgressAt = DateTime.UtcNow;
            }

            if (request.Status == TicketStatus.Closed)
            {
                ticket.ClosedAt = DateTime.UtcNow;
            }

            await _ticketRepository.UpdateAsync(ticket);

            // =========================
            // SYSTEM MESSAGES (FIXED)
            // =========================

            if (request.Status == TicketStatus.InProgress)
            {
                await _mediator.Send(
                    new CreateSystemMessageCommand(
                        ticket.Id,
                        $"{_currentUser.Email} started working on the ticket",
                        SystemMessageType.AgentStarted
                    ),
                    cancellationToken);
            }

            if (request.Status == TicketStatus.Closed)
            {
                await _mediator.Send(
                    new CreateSystemMessageCommand(
                        ticket.Id,
                        $"{_currentUser.Email} closed the ticket",
                        SystemMessageType.TicketClosed
                    ),
                    cancellationToken);
            }

            // =========================
            // AUDIT LOG
            // =========================
            await _auditLogRepository.AddAsync(new AuditLog
            {
                UserId = _currentUser.UserId,
                UserRole = _currentUser.Role,
                TicketId = ticket.Id,
                Action = request.Status == TicketStatus.Closed
                    ? "Ticket closed"
                    : "Ticket moved to In Progress",
                CreatedAt = DateTime.UtcNow
            });
        }
    }
}
