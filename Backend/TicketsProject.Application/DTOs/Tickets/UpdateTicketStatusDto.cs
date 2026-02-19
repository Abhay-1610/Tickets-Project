using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketsProject.Domain.Enums;

namespace TicketsProject.Application.DTOs.Tickets
{
    public class UpdateTicketStatusDto
    {
        //public int TicketId { get; set; }
        public TicketStatus Status { get; set; }
    }
}
