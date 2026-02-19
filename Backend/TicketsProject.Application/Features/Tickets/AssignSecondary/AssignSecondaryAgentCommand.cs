using MediatR;

namespace TicketsProject.Application.Features.Tickets.AssignSecondary
{
    public sealed class AssignSecondaryAgentCommand : IRequest
    {
        public int TicketId { get; }
        public string AgentId { get; }

        public AssignSecondaryAgentCommand(int ticketId, string agentId)
        {
            TicketId = ticketId;
            AgentId = agentId;
        }
    }
}
