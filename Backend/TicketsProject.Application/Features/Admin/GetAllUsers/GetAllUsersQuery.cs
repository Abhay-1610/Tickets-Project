using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketsProject.Application.Common;
using TicketsProject.Application.DTOs.Admin;
using TicketsProject.Application.Interfaces;

namespace TicketsProject.Application.Features.Admin.GetAllUsers
{
    public sealed class GetAllUsersQuery : IRequest<List<AdminUserResult>>
    {
    }
}
