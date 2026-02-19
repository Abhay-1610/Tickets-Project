using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TicketsProject.Domain.Entities
{
    public class AuditLog
    {
        public int Id { get; set; }

        public string? UserId { get; set; }
        public string UserRole { get; set; } = null!;

        public int? TicketId { get; set; }

        public string Action { get; set; } = null!;

        public DateTime CreatedAt { get; set; }
    }
}
