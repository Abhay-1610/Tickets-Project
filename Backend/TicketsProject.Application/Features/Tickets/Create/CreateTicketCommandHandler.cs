using MediatR;
using TicketsProject.Application.Common;
using TicketsProject.Application.Features.Messages.System;
using TicketsProject.Application.Interfaces;
using TicketsProject.Domain.Entities;
using TicketsProject.Domain.Enums;

namespace TicketsProject.Application.Features.Tickets.Create
{
    public sealed class CreateTicketCommandHandler
        : IRequestHandler<CreateTicketCommand, int>
    {
        private readonly ITicketRepository _ticketRepository;
        private readonly IAuditLogRepository _auditLogRepository;
        private readonly ICurrentUserService _currentUser;
        private readonly IMediator _mediator;

        public CreateTicketCommandHandler(
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

        public async Task<int> Handle(
            CreateTicketCommand request,
            CancellationToken cancellationToken)
        {
            // only customer can create ticket
            if (_currentUser.Role != RoleConstants.Customer)
                throw new UnauthorizedAccessException();

            if (request.Ticket == null)
                throw new ArgumentException("Ticket data is required");

            var ticket = new Ticket
            {
                CustomerId = _currentUser.UserId,
                Title = request.Ticket.Title,
                Description = request.Ticket.Description,
                Status = TicketStatus.Open,
                InitialScreenshotUrl = request.Ticket.InitialScreenshotUrl,
                CreatedAt = DateTime.UtcNow
            };

            // create ticket
            var ticketId = await _ticketRepository.CreateAsync(ticket);

            // =========================
            // INITIAL SYSTEM MESSAGE
            // =========================
            await _mediator.Send(
                new CreateSystemMessageCommand(
                    ticketId,
                    "Waiting for agent to join",
                    SystemMessageType.AgentAssigned // or WaitingForAgent if you add it
                ),
                cancellationToken);

            // =========================
            // AUDIT LOG
            // =========================
            await _auditLogRepository.AddAsync(new AuditLog
            {
                UserId = _currentUser.UserId,
                UserRole = _currentUser.Role,
                TicketId = ticketId,
                Action = "Ticket created",
                CreatedAt = DateTime.UtcNow
            });

            return ticketId;
        }
    }
}
