using MediatR;
using TicketsProject.Application.DTOs.Messages;

namespace TicketsProject.Application.Features.Messages.Send
{
    public sealed class SendMessageCommand : IRequest<TicketMessageDto>
    {
        public SendMessageDto Message { get; }

        public SendMessageCommand(SendMessageDto message)
        {
            Message = message;
        }
    }
}
