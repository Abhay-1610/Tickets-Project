using MediatR;
using TicketsProject.Domain.Enums;

namespace TicketsProject.Application.Features.Messages.System
{
    public sealed class CreateSystemMessageCommand : IRequest
    {
        public int TicketId { get; }
        public string Message { get; }
        public SystemMessageType SystemType { get; }

        public CreateSystemMessageCommand(int ticketId, string message,SystemMessageType systemType)
        {
            TicketId = ticketId;
            Message = message;
            SystemType = systemType;
        }
    }
}
