using TicketsProject.Application.DTOs.AuditLogs;
using TicketsProject.Domain.Entities;

namespace TicketsProject.Application.Interfaces
{
    public interface IAuditLogRepository
    {
        Task AddAsync(AuditLog log);
        Task<List<AuditLogDto>> GetAllAsync();
    }
}
