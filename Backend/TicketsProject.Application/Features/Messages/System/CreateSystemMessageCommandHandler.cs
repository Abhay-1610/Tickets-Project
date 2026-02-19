using MediatR;
using TicketsProject.Application.DTOs.Messages;
using TicketsProject.Application.Interfaces;
using TicketsProject.Domain.Entities;
using TicketsProject.Domain.Enums;

namespace TicketsProject.Application.Features.Messages.System
{
    public sealed class CreateSystemMessageCommandHandler
        : IRequestHandler<CreateSystemMessageCommand>
    {
        private readonly IMessageRepository _messageRepository;
        private readonly IRealtimeNotifier _realtimeNotifier;
        private readonly ICurrentUserService _currentUser;

        public CreateSystemMessageCommandHandler(
            IMessageRepository messageRepository,
            IRealtimeNotifier realtimeNotifier,
            ICurrentUserService currentUser)
        {
            _messageRepository = messageRepository;
            _realtimeNotifier = realtimeNotifier;
            _currentUser = currentUser;
        }

        public async Task Handle(
            CreateSystemMessageCommand request,
            CancellationToken cancellationToken)
        {
            var entity = new TicketMessage
            {
                TicketId = request.TicketId,
                Message = request.Message, // UI text (can include name)
                MessageType = MessageType.System,
                SystemType = request.SystemType, // ✅ LOGIC
                CreatedAt = DateTime.UtcNow
            };

            await _messageRepository.AddAsync(entity);

            var dto = new TicketMessageDto
            {
                Id = entity.Id,
                TicketId = entity.TicketId,
                Message = entity.Message,
                IsSystem = true,
                SystemType = entity.SystemType,
                CreatedAt = entity.CreatedAt
            };

            await _realtimeNotifier.NotifyTicketAsync(
                entity.TicketId,
                "SystemMessage",
                dto);
        }
    }
}
