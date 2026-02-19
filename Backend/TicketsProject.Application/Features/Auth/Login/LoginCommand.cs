using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketsProject.Application.DTOs.Auth;

namespace TicketsProject.Application.Features.Auth.Login
{
    public sealed class LoginCommand : IRequest<LoginResponseDto>
    {
        public LoginRequestDto Request { get; }

        public LoginCommand(LoginRequestDto request)
        {
            Request = request ?? throw new ArgumentNullException(nameof(request));
        }
    }
}
