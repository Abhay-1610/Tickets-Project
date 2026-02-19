using MediatR;
using TicketsProject.Application.Common;
using TicketsProject.Application.Features.Messages.System;
using TicketsProject.Application.Interfaces;
using TicketsProject.Domain.Enums;
using TicketsProject.Domain.Entities;

namespace TicketsProject.Application.Features.Tickets.ConfirmResolution
{
    public sealed class ConfirmTicketResolutionCommandHandler
        : IRequestHandler<ConfirmTicketResolutionCommand>
    {
        private readonly ITicketRepository _ticketRepository;
        private readonly IAuditLogRepository _auditLogRepository;
        private readonly IMediator _mediator;
        private readonly ICurrentUserService _currentUser;
        private readonly IRealtimeNotifier _realtimeNotifier;

        public ConfirmTicketResolutionCommandHandler(
            ITicketRepository ticketRepository,
            IAuditLogRepository auditLogRepository,
            IMediator mediator,
            ICurrentUserService currentUser,
            IRealtimeNotifier realtimeNotifier)
        {
            _ticketRepository = ticketRepository;
            _auditLogRepository = auditLogRepository;
            _mediator = mediator;
            _currentUser = currentUser;
            _realtimeNotifier = realtimeNotifier;
        }

        public async Task Handle(
            ConfirmTicketResolutionCommand request,
            CancellationToken cancellationToken)
        {
            // only customer can confirm
            if (_currentUser.Role != RoleConstants.Customer)
                throw new UnauthorizedAccessException();

            var ticket = await _ticketRepository.GetByIdAsync(request.TicketId)
                ?? throw new KeyNotFoundException("Ticket not found");

            if (ticket.CustomerId != _currentUser.UserId)
                throw new UnauthorizedAccessException();

            if (ticket.Status != TicketStatus.InProgress)
                throw new InvalidOperationException("Ticket not in progress");

            // update ticket confirmation
            ticket.CustomerConfirmedResolution = request.IsResolved;
            await _ticketRepository.UpdateAsync(ticket);

            // =========================
            // SYSTEM MESSAGE (FIXED)
            // =========================
            if (request.IsResolved)
            {
                await _mediator.Send(
                    new CreateSystemMessageCommand(
                        ticket.Id,
                        "Customer confirmed the issue is resolved",
                        SystemMessageType.CustomerConfirmed
                    ),
                    cancellationToken);
            }
            else
            {
                await _mediator.Send(
                    new CreateSystemMessageCommand(
                        ticket.Id,
                        "Customer reported the issue is not resolved",
                        SystemMessageType.CustomerRejected
                    ),
                    cancellationToken);
            }

            // =========================
            // AUDIT LOG
            // =========================
            var action = request.IsResolved
                ? "Customer confirmed resolution"
                : "Customer reported issue not resolved";

            await _auditLogRepository.AddAsync(new AuditLog
            {
                UserId = _currentUser.UserId,
                UserRole = _currentUser.Role,
                TicketId = ticket.Id,
                Action = action,
                CreatedAt = DateTime.UtcNow
            });

            // =========================
            // REALTIME NOTIFY (UNCHANGED)
            // =========================
            await _realtimeNotifier.NotifyTicketAsync(
                ticket.Id,
                "ResolutionConfirmed",
                new
                {
                    TicketId = ticket.Id,
                    Confirmed = request.IsResolved
                });
        }
    }
}
