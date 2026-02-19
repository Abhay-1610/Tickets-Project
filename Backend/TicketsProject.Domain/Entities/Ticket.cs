using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketsProject.Domain.Enums;

namespace TicketsProject.Domain.Entities
{
    public class Ticket
    {
        public int Id { get; set; }

        public string CustomerId { get; set; } = null!;      // AspNetUsers

        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;

        public string? InitialScreenshotUrl { get; set; }

        public TicketStatus Status { get; set; } = TicketStatus.Open;
        public bool? CustomerConfirmedResolution { get; set; }

        public ICollection<TicketAgent> TicketAgents { get; set; } = new List<TicketAgent>();



        public DateTime CreatedAt { get; set; }
        public DateTime? InProgressAt { get; set; }
        public DateTime? ClosedAt { get; set; }
    }
}
