using MediatR;
using TicketsProject.Application.Common;
using TicketsProject.Application.DTOs.Admin;
using TicketsProject.Application.Interfaces;

namespace TicketsProject.Application.Features.Admin.CreateAgent
{
    public sealed class CreateAgentCommandHandler
        : IRequestHandler<CreateAgentCommand, AdminUserResult>
    {
        private readonly IAuthRepository _authRepository;
        private readonly ICurrentUserService _currentUser;

        public CreateAgentCommandHandler(
            IAuthRepository authRepository,
            ICurrentUserService currentUser)
        {
            _authRepository = authRepository;
            _currentUser = currentUser;
        }

        public async Task<AdminUserResult> Handle(
            CreateAgentCommand request,
            CancellationToken cancellationToken)
        {
            if (_currentUser.Role != RoleConstants.Admin)
                throw new UnauthorizedAccessException();

            return await _authRepository.CreateAgentAsync(
                request.Email, request.Password);

          
        }
    }
}
