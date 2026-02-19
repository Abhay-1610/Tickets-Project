using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketsProject.Application.DTOs.Auth;
using TicketsProject.Application.Interfaces;

namespace TicketsProject.Application.Features.Auth.RefreshToken
{
    public sealed class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, LoginResponseDto>
    {
        private readonly IAuthRepository _authRepository;

        public RefreshTokenCommandHandler(IAuthRepository authRepository)
        {
            _authRepository = authRepository;
        }

        public async Task<LoginResponseDto> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(request.RefreshToken))
                throw new ArgumentException("Refresh token is required");

            return await _authRepository.RefreshTokenAsync(request.RefreshToken);
        }
    }
}
