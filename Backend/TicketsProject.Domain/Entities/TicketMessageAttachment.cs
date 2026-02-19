using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TicketsProject.Domain.Entities
{
    public class TicketMessageAttachment
    {
        public int Id { get; set; }

        public int MessageId { get; set; }            // FK → TicketMessages
        public TicketMessage? Message { get; set; }

        public string ImageUrl { get; set; } = null!;

        public DateTime CreatedAt { get; set; }
    }
}
