using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TicketsProject.Application.Features.Auth.Register
{
    public class RegisterCustomerCommand : IRequest
    {
        public string Email { get; }
        public string Password { get; }

        public RegisterCustomerCommand(string email, string password)
        {
            Email = email ?? throw new ArgumentNullException(nameof(email));
            Password = password ?? throw new ArgumentNullException(nameof(password));
        }
    }
}
