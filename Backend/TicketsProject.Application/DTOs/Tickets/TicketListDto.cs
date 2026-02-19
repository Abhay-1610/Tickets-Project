using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketsProject.Domain.Enums;

namespace TicketsProject.Application.DTOs.Tickets
{
    public sealed class TicketListDto
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        public TicketStatus Status { get; set; }

        public string CustomerId { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public string PrimaryAgentEmail { get; set; } = string.Empty;
        public string? PrimaryAgentId { get; set; }

        public List<string> SecondaryAgentIds { get; set; } = new();
        public List<string> SecondaryAgentEmails { get; set; } = new();

        public DateTime CreatedAt { get; set; }
        public DateTime? InProgressAt { get; set; }
        public DateTime? ClosedAt { get; set; }
    }

}
