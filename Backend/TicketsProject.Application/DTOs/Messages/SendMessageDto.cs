using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TicketsProject.Application.DTOs.Messages
{
    public class SendMessageDto
    {
        public int TicketId { get; set; }
        public string? Message { get; set; }
        public List<string>? ImageUrls { get; set; }
    }

}
