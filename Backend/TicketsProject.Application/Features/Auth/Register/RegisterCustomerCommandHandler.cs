using MediatR;
using TicketsProject.Application.Interfaces;

namespace TicketsProject.Application.Features.Auth.Register
{
    public sealed class RegisterCustomerCommandHandler
        : IRequestHandler<RegisterCustomerCommand>
    {
        private readonly IAuthRepository _authRepository;

        public RegisterCustomerCommandHandler(IAuthRepository authRepository)
        {
            _authRepository = authRepository;
        }

        public async Task Handle(RegisterCustomerCommand request,CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.Email))
                throw new ArgumentException("Email is required");

            if (string.IsNullOrWhiteSpace(request.Password))
                throw new ArgumentException("Password is required");

            await _authRepository.RegisterCustomerAsync(request.Email,request.Password);
        }
    }
}
