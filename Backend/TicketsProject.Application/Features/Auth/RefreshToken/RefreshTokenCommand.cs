using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketsProject.Application.DTOs.Auth;

namespace TicketsProject.Application.Features.Auth.RefreshToken
{
    public sealed class RefreshTokenCommand : IRequest<LoginResponseDto>
    {
        public string RefreshToken { get; }

        public RefreshTokenCommand(string refreshToken)
        {
            RefreshToken = refreshToken ?? throw new ArgumentNullException(nameof(refreshToken));
        }
    }
}
