  using MediatR;
using TicketsProject.Application.Common;
using TicketsProject.Application.Interfaces;
using TicketsProject.Domain.Entities;
using TicketsProject.Domain.Enums;

namespace TicketsProject.Application.Features.Tickets.Assign
{
    public sealed class AssignAgentCommandHandler
        : IRequestHandler<AssignAgentCommand>
    {
        private readonly ITicketRepository _ticketRepository;
        private readonly IAuditLogRepository _auditLogRepository;
        private readonly ICurrentUserService _currentUser;

        public AssignAgentCommandHandler(
            ITicketRepository ticketRepository,
            IAuditLogRepository auditLogRepository,
            ICurrentUserService currentUser)
        {
            _ticketRepository = ticketRepository;
            _auditLogRepository = auditLogRepository;
            _currentUser = currentUser;
        }

        public async Task Handle(
            AssignAgentCommand request,
            CancellationToken cancellationToken)
        {
            if (_currentUser.Role != RoleConstants.Agent &&
                _currentUser.Role != RoleConstants.Admin)
                throw new UnauthorizedAccessException();

            var ticket = await _ticketRepository.GetByIdAsync(request.TicketId)
                ?? throw new KeyNotFoundException("Ticket not found");

            if (ticket.Status == TicketStatus.Closed)
                throw new InvalidOperationException("Ticket is closed");

            var agent = new TicketAgent
            {
                TicketId = request.TicketId,
                AgentId = _currentUser.UserId,
                IsPrimary = true, // rule later
                AssignedAt = DateTime.UtcNow
            };

            // assign agent
            await _ticketRepository.AssignAgentAsync(agent);

            // ---- AUDIT LOG ----
            await _auditLogRepository.AddAsync(new AuditLog
            {
                UserId = _currentUser.UserId,
                UserRole = _currentUser.Role,
                TicketId = request.TicketId,
                Action = "Agent assigned to ticket",
                CreatedAt = DateTime.UtcNow
            });
        }
    }
}
