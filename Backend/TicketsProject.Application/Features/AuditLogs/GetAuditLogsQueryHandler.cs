using MediatR;
using TicketsProject.Application.DTOs.AuditLogs;
using TicketsProject.Application.Interfaces;

namespace TicketsProject.Application.Features.AuditLogs
{
    public sealed class GetAuditLogsQueryHandler : IRequestHandler<GetAuditLogsQuery, List<AuditLogDto>>
    {
        private readonly IAuditLogRepository _auditLogRepository;

        public GetAuditLogsQueryHandler(IAuditLogRepository auditLogRepository)
        {
            _auditLogRepository = auditLogRepository;
        }

        public async Task<List<AuditLogDto>> Handle(GetAuditLogsQuery request,CancellationToken cancellationToken)
        {
            return await _auditLogRepository.GetAllAsync();
        }
    }
}
