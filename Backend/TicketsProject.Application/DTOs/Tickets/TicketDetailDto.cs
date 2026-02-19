using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketsProject.Domain.Enums;

namespace TicketsProject.Application.DTOs.Tickets
{
    public class TicketDetailDto
    {
        public int Id { get; set; }

        public string? CustomerId { get; set; }
        public string? CustomerEmail { get; set; }


        public string? Title { get; set; }
        public string? Description { get; set; }

        public string? InitialScreenshotUrl { get; set; }
        public string? PrimaryAgentId { get; set; }
        public List<string> SecondaryAgentIds { get; set; } = new();


        public TicketStatus Status { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? InProgressAt { get; set; }
        public DateTime? ClosedAt { get; set; }
    }
}
