using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketsProject.Domain.Enums;

namespace TicketsProject.Application.DTOs.Messages
{
    public class TicketMessageDto
    {
        public int Id { get; set; }
        public int TicketId { get; set; }

        public string? SenderId { get; set; }
        public string? SenderRole { get; set; }
        public string? SenderEmail { get; set; }

        public string? Message { get; set; }
        public List<string> ImageUrls { get; set; } = [];

        public bool IsSystem { get; set; }
        public SystemMessageType? SystemType { get; set; }
        public DateTime CreatedAt { get; set; }
    }

}
