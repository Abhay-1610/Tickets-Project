using TicketsProject.Domain.Enums;

namespace TicketsProject.Domain.Entities
{
    public class TicketMessage
    {
        public int Id { get; set; }

        public int TicketId { get; set; }          // FK → Tickets
        public Ticket? Ticket { get; set; }

        public string? SenderId { get; set; }      // AspNetUsers

        public string? Message { get; set; }

        public MessageType MessageType { get; set; } = MessageType.User;
        public SystemMessageType? SystemType { get; set; }


        public DateTime CreatedAt { get; set; }

        public ICollection<TicketMessageAttachment> Attachments { get; set; }
            = new List<TicketMessageAttachment>();
    }
}
