using MediatR;
using TicketsProject.Application.DTOs.Admin;

namespace TicketsProject.Application.Features.Admin.CreateAgent
{
    public sealed class CreateAgentCommand : IRequest<AdminUserResult>
    {
        public string Email { get; }
        public string Password { get; }

        public CreateAgentCommand(string email, string password)
        {
            Email = email;
            Password = password;
        }
    }
}
