using MediatR;
using TicketsProject.Application.Common;
using TicketsProject.Application.DTOs.Admin;
using TicketsProject.Application.Interfaces;

namespace TicketsProject.Application.Features.Admin.UnblockUser
{
    public sealed class UnblockUserCommandHandler
        : IRequestHandler<UnblockUserCommand, AdminUserResult>
    {
        private readonly IAuthRepository _authRepository;
        private readonly ICurrentUserService _currentUser;

        public UnblockUserCommandHandler(
            IAuthRepository authRepository,
            ICurrentUserService currentUser)
        {
            _authRepository = authRepository;
            _currentUser = currentUser;
        }

        public async Task<AdminUserResult> Handle(
            UnblockUserCommand request,
            CancellationToken cancellationToken)
        {
            if (_currentUser.Role != RoleConstants.Admin)
                throw new UnauthorizedAccessException();

            return await _authRepository.UnblockUserAsync(request.UserId);

    
        }
    }
}
