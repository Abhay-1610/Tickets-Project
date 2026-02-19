using Microsoft.EntityFrameworkCore;
using TicketsProject.Application.DTOs.Messages;
using TicketsProject.Application.Interfaces;
using TicketsProject.Domain.Entities;
using TicketsProject.Infrastructure.Data;

namespace TicketsProject.Infrastructure.Repositories
{
    public sealed class MessageRepository : IMessageRepository
    {
        private readonly ApplicationDbContext _db;

        public MessageRepository(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task AddAsync(TicketMessage message)
        {
            _db.TicketMessages.Add(message);
            await _db.SaveChangesAsync(); // message + attachments
        }

        public async Task<List<TicketMessageDto>> GetByTicketDtoAsync(int ticketId)
        {
            return await _db.TicketMessages
                .AsNoTracking()
                .Where(m => m.TicketId == ticketId)
                .OrderBy(m => m.CreatedAt)
                .Select(m => new TicketMessageDto
                {
                    Id = m.Id,
                    TicketId = m.TicketId,
                    SenderId = m.SenderId,
                    SenderRole = (
                from ur in _db.UserRoles
                join r in _db.Roles
                    on ur.RoleId equals r.Id
                where ur.UserId == m.SenderId
                select r.Name
            ).FirstOrDefault(),

                    SenderEmail = _db.Users
    .Where(u => u.Id == m.SenderId)
    .Select(u => u.Email)
    .FirstOrDefault(),


                    Message = m.Message,
                    IsSystem = m.MessageType ==
                               Domain.Enums.MessageType.System,
                    CreatedAt = m.CreatedAt,
                    ImageUrls = m.Attachments
                        .Select(a => a.ImageUrl)
                        .ToList()
                })
                .ToListAsync();
        }
    }
}
