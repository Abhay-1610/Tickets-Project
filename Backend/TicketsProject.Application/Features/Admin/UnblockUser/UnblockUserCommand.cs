using MediatR;
using TicketsProject.Application.DTOs.Admin;

namespace TicketsProject.Application.Features.Admin.UnblockUser
{
    public sealed class UnblockUserCommand : IRequest<AdminUserResult>
    {
        public string UserId { get; }

        public UnblockUserCommand(string userId)
        {
            UserId = userId;
        }
    }
}
