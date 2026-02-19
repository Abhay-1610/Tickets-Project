using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TicketsProject.Domain.Entities
{
    public class TicketAgent
    {
        public int Id { get; set; }

        public int TicketId { get; set; }                    // FK → Tickets
        public Ticket? Ticket { get; set; }
        public string AgentId { get; set; } = null!;         // AspNetUsers

        public bool IsPrimary { get; set; }                   // Exactly one Primary per ticket

        public DateTime AssignedAt { get; set; }
    }
}
