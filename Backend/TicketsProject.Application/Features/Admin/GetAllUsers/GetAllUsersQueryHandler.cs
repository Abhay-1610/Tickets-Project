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
    public sealed class GetAllUsersQueryHandler
       : IRequestHandler<GetAllUsersQuery, List<AdminUserResult>>
    {
        private readonly IAuthRepository _authRepository;
        private readonly ICurrentUserService _currentUser;


        public GetAllUsersQueryHandler(IAuthRepository authRepository, ICurrentUserService currentUser)
        {
            _authRepository = authRepository;
            _currentUser = currentUser;
        }

       

        public async Task<List<AdminUserResult>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
        {
            if (_currentUser.Role != RoleConstants.Admin)
                throw new UnauthorizedAccessException();


            return await _authRepository.GetAllUsersAsync();
        }
    }
}
