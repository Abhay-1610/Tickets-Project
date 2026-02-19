using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TicketsProject.Application.DTOs.Tickets
{
    public class CreateTicketDto
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? InitialScreenshotUrl { get; set; }
    }
}
