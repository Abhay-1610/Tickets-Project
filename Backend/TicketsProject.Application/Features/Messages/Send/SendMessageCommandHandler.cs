using MediatR;
using TicketsProject.Application.Common;
using TicketsProject.Application.DTOs.Messages;
using TicketsProject.Application.Interfaces;
using TicketsProject.Domain.Entities;
using TicketsProject.Domain.Enums;

namespace TicketsProject.Application.Features.Messages.Send
{
    public sealed class SendMessageCommandHandler
        : IRequestHandler<SendMessageCommand, TicketMessageDto>
    {
        private readonly IMessageRepository _messageRepository;
        private readonly ITicketRepository _ticketRepository;
        private readonly ICurrentUserService _currentUser;
        private readonly IRealtimeNotifier _realtimeNotifier;

        public SendMessageCommandHandler(
            IMessageRepository messageRepository,
            ITicketRepository ticketRepository,
            ICurrentUserService currentUser,
            IRealtimeNotifier realtimeNotifier)
        {
            _messageRepository = messageRepository;
            _ticketRepository = ticketRepository;
            _currentUser = currentUser;
            _realtimeNotifier = realtimeNotifier;
        }

        public async Task<TicketMessageDto> Handle(
            SendMessageCommand request,
            CancellationToken cancellationToken)
        {
            if (request.Message == null)
                throw new ArgumentException("Message required");

            if (string.IsNullOrWhiteSpace(request.Message.Message) &&
                (request.Message.ImageUrls == null ||
                 !request.Message.ImageUrls.Any()))
                throw new ArgumentException("Message or image required");

            var ticket = await _ticketRepository
                .GetByIdAsync(request.Message.TicketId)
                ?? throw new KeyNotFoundException("Ticket not found");

            if (ticket.Status == TicketStatus.Closed)
                throw new InvalidOperationException("Ticket closed");

            // customer ownership check
            if (_currentUser.Role == RoleConstants.Customer &&
                ticket.CustomerId != _currentUser.UserId)
                throw new UnauthorizedAccessException();

            var entity = new TicketMessage
            {
                TicketId = ticket.Id,
                SenderId = _currentUser.UserId,
                Message = request.Message.Message,
                MessageType = MessageType.User,
                CreatedAt = DateTime.UtcNow
            };

            // add attachments (0..N)
            if (request.Message.ImageUrls != null)
            {
                foreach (var url in request.Message.ImageUrls)
                {
                    entity.Attachments.Add(
                        new TicketMessageAttachment
                        {
                            ImageUrl = url,
                            CreatedAt = DateTime.UtcNow
                        });
                }
            }

            // save message + attachments together
            await _messageRepository.AddAsync(entity);

            var dto = new TicketMessageDto
            {
                Id = entity.Id,
                TicketId = entity.TicketId,
                SenderId = entity.SenderId,
                SenderRole = _currentUser.Role,
                SenderEmail = _currentUser.Email,
                Message = entity.Message,
                IsSystem = false,
                CreatedAt = entity.CreatedAt,
                ImageUrls = entity.Attachments.Select(a => a.ImageUrl).ToList()
            };

            // realtime broadcast
            await _realtimeNotifier.NotifyTicketAsync(
                entity.TicketId,
                "MessageReceived",
                dto);

            return dto;
        }
    }
}
