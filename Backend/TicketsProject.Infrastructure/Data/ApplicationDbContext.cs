using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Net.Sockets;
using TicketsProject.Domain.Entities;

namespace TicketsProject.Infrastructure.Data
{
    public class ApplicationDbContext
        : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(
            DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<TicketAgent> TicketAgents { get; set; }
        public DbSet<TicketMessage> TicketMessages { get; set; }
        public DbSet<TicketMessageAttachment> TicketMessageAttachments { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }

       
    }
}
