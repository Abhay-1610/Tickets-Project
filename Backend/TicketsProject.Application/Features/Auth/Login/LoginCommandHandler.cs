using MediatR;
using TicketsProject.Application.DTOs.Auth;
using TicketsProject.Application.Interfaces;

namespace TicketsProject.Application.Features.Auth.Login
{
    public sealed class LoginCommandHandler
        : IRequestHandler<LoginCommand, LoginResponseDto>
    {
        private readonly IAuthRepository _authRepository;

        public LoginCommandHandler(IAuthRepository authRepository)
        {
            _authRepository = authRepository;
        }

        public async Task<LoginResponseDto> Handle(LoginCommand request,CancellationToken cancellationToken)
        {
            if (request.Request == null)
                throw new ArgumentException("Login data is required");

            return await _authRepository.LoginAsync(request.Request);
        }
    }
}
