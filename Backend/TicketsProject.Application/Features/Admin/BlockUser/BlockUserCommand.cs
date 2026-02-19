using MediatR;
using TicketsProject.Application.DTOs.Admin;

namespace TicketsProject.Application.Features.Admin.BlockUser
{
    public sealed class BlockUserCommand : IRequest<AdminUserResult>
    {
        public string UserId { get; }

        public BlockUserCommand(string userId)
        {
            UserId = userId;
        }
    }
}
