using MediatR;
using TicketsProject.Application.Common;
using TicketsProject.Application.DTOs.Admin;
using TicketsProject.Application.Interfaces;

namespace TicketsProject.Application.Features.Admin.BlockUser
{
    public sealed class BlockUserCommandHandler
        : IRequestHandler<BlockUserCommand, AdminUserResult>
    {
        private readonly IAuthRepository _authRepository;
        private readonly ICurrentUserService _currentUser;

        public BlockUserCommandHandler(
            IAuthRepository authRepository,
            ICurrentUserService currentUser)
        {
            _authRepository = authRepository;
            _currentUser = currentUser;
        }

        public async Task<AdminUserResult> Handle(
            BlockUserCommand request,
            CancellationToken cancellationToken)
        {
            if (_currentUser.Role != RoleConstants.Admin)
                throw new UnauthorizedAccessException();

            if (request.UserId == _currentUser.UserId)
                throw new InvalidOperationException("Cannot block yourself");

            return await _authRepository.BlockUserAsync(request.UserId);

           
        }
    }
}
