using Microsoft.EntityFrameworkCore;
using TicketsProject.Application.DTOs.Tickets;
using TicketsProject.Domain.Entities;
using TicketsProject.Domain.Enums;
using TicketsProject.Infrastructure.Data;

namespace TicketsProject.Infrastructure.Repositories;

public sealed class TicketRepository : ITicketRepository
{ 
    private readonly ApplicationDbContext _db;

    public TicketRepository(ApplicationDbContext db)
    {
        _db = db;
    }

    // -------- CREATE --------
    public async Task<int> CreateAsync(Ticket ticket)
    {
        _db.Tickets.Add(ticket);
        await _db.SaveChangesAsync();
        return ticket.Id;
    }

    // -------- GET ENTITY (internal use) --------
    public async Task<Ticket?> GetByIdAsync(int ticketId)
    {
        return await _db.Tickets
            .FirstOrDefaultAsync(t => t.Id == ticketId);
    }

    // -------- CUSTOMER TICKETS --------
    public async Task<List<TicketListDto>> GetByCustomerIdAsync(string customerId)
    {
        return await _db.Tickets
            .AsNoTracking()
            .Where(t => t.CustomerId == customerId)
            .Select(t => new TicketListDto
            {
                Id = t.Id,
                Title = t.Title,
                Status = t.Status,
                CreatedAt = t.CreatedAt
            })
            .ToListAsync();
    }

    // -------- AGENT / ADMIN --------
    public async Task<List<TicketListDto>> GetAllAsync()
    {
        return await _db.Tickets
            .AsNoTracking()
            .Select(t => new TicketListDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                Status = t.Status,

                CustomerId = t.CustomerId,

                CustomerEmail = _db.Users
                    .Where(u => u.Id == t.CustomerId)
                    .Select(u => u.Email)
                    .Where(e => e != null)
                    .Select(e => e!)
                    .FirstOrDefault() ?? "Unknown",

                // PRIMARY
                PrimaryAgentId = t.TicketAgents
                    .Where(a => a.IsPrimary)
                    .Select(a => a.AgentId)
                    .FirstOrDefault(),

                PrimaryAgentEmail = t.TicketAgents
                    .Where(a => a.IsPrimary)
                    .Join(
                        _db.Users,
                        ta => ta.AgentId,
                        u => u.Id,
                        (ta, u) => u.Email
                    )
                    .Where(e => e != null)
                    .Select(e => e!)
                    .FirstOrDefault() ?? "Unassigned",

                // SECONDARY
                SecondaryAgentIds = t.TicketAgents
                    .Where(a => !a.IsPrimary)
                    .Select(a => a.AgentId)
                    .ToList(),

                SecondaryAgentEmails = t.TicketAgents
                    .Where(a => !a.IsPrimary)
                    .Join(
                        _db.Users,
                        ta => ta.AgentId,
                        u => u.Id,
                        (ta, u) => u.Email
                    )
                    .Where(e => e != null)
                    .Select(e => e!)
                    .ToList(),

                CreatedAt = t.CreatedAt,
                InProgressAt = t.InProgressAt,
                ClosedAt = t.ClosedAt
            })
            .ToListAsync();
    }





    // -------- DETAIL --------
    public async Task<TicketDetailDto?> GetDetailAsync(int ticketId)
    {
        return await _db.Tickets
            .AsNoTracking()
            .Where(t => t.Id == ticketId)
            .Select(t => new TicketDetailDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                Status = t.Status,
                CreatedAt = t.CreatedAt,
                CustomerId = t.CustomerId,
                CustomerEmail = _db.Users
    .Where(u => u.Id == t.CustomerId)
    .Select(u => u.Email)
    .FirstOrDefault(),

                InitialScreenshotUrl = t.InitialScreenshotUrl,
                PrimaryAgentId = t.TicketAgents
                .Where(a => a.IsPrimary)
                .Select(a => a.AgentId)
                .FirstOrDefault(),
                SecondaryAgentIds = t.TicketAgents
                .Where(a => !a.IsPrimary)
                .Select(a => a.AgentId)
                .ToList()
            })
            .FirstOrDefaultAsync();
    }

    // -------- ASSIGN AGENT --------
    public async Task AssignAgentAsync(TicketAgent agent)
    {
        _db.TicketAgents.Add(agent);
        await _db.SaveChangesAsync(); 
    }

    // -------- UPDATE STATUS --------
    public async Task UpdateStatusAsync(int ticketId, TicketStatus status)
    {
        var ticket = await _db.Tickets.FindAsync(ticketId);
        if (ticket == null) return;

        ticket.Status = status;
        await _db.SaveChangesAsync();
    }

    public async Task UpdateAsync(Ticket ticket)
    {
        _db.Tickets.Update(ticket);
        await _db.SaveChangesAsync();
    }

    public async Task<bool> IsAgentAssignedAsync(int ticketId, string agentId)
    {
        return await _db.TicketAgents
            .AsNoTracking()
            .AnyAsync(a =>
                a.TicketId == ticketId &&
                a.AgentId == agentId);
    }

}
