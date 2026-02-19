using MediatR;
using TicketsProject.Application.DTOs.AuditLogs;
using TicketsProject.Domain.Entities;

namespace TicketsProject.Application.Features.AuditLogs
{
    public sealed class GetAuditLogsQuery : IRequest<List<AuditLogDto>>
    {
    }
}
