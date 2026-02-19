using Microsoft.EntityFrameworkCore;
using TicketsProject.Application.DTOs.AuditLogs;
using TicketsProject.Application.Interfaces;
using TicketsProject.Domain.Entities;
using TicketsProject.Infrastructure.Data;

namespace TicketsProject.Infrastructure.Repositories
{
    public sealed class AuditLogRepository : IAuditLogRepository
    {
        private readonly ApplicationDbContext _db;

        public AuditLogRepository(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task AddAsync(AuditLog log)
        {
            _db.AuditLogs.Add(log);
            await _db.SaveChangesAsync();
        }

        public async Task<List<AuditLogDto>> GetAllAsync()
        {
            return await _db.AuditLogs
                .AsNoTracking()
                .OrderByDescending(a => a.CreatedAt)
                .Select(a => new AuditLogDto
                {
                    Id = a.Id,
                    UserId = a.UserId,
                    UserRole = a.UserRole,
                    Action = a.Action,
                    CreatedAt = a.CreatedAt,

                    PrimaryAgentEmail = _db.TicketAgents
                .Where(ta =>
                    ta.TicketId == a.TicketId &&
                    ta.IsPrimary
                )
                .Join(
                    _db.Users,
                    ta => ta.AgentId,
                    u => u.Id,
                    (ta, u) => u.Email
                )
                .FirstOrDefault() ?? "Unassigned",

                    // join user
                    UserEmail = _db.Users
                        .Where(u => u.Id == a.UserId)
                        .Select(u => u.Email)
                        .FirstOrDefault(),

                    // join ticket
                    TicketId = a.TicketId,
                    TicketTitle = _db.Tickets
                        .Where(t => t.Id == a.TicketId)
                        .Select(t => t.Title)
                        .FirstOrDefault()
                })
                .ToListAsync();
        }

    }
}
