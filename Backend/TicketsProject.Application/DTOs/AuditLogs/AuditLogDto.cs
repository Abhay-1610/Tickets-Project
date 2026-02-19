using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TicketsProject.Application.DTOs.AuditLogs
{
    public sealed class AuditLogDto
    {
        public int Id { get; set; }

        public string? UserId { get; set; }
        public string? UserEmail { get; set; }
        public string UserRole { get; set; } = null!;

        public int? TicketId { get; set; }
        public string? TicketTitle { get; set; }
        public string PrimaryAgentEmail { get; set; } = "Unassigned";


        public string Action { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
    }

}
