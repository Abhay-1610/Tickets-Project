using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketsProject.Application.DTOs.Admin;
using TicketsProject.Application.DTOs.Auth;
using TicketsProject.Application.DTOs.Tickets;

namespace TicketsProject.Application.Interfaces
{
    public interface IAuthRepository
    {
        Task<LoginResponseDto> LoginAsync(LoginRequestDto request);
        Task<LoginResponseDto> RefreshTokenAsync(string refreshToken);

        Task RegisterCustomerAsync(string email, string password);

        Task<AdminUserResult> CreateAgentAsync(string email, string password);
        Task<AdminUserResult> BlockUserAsync(string userId);
        Task<AdminUserResult> UnblockUserAsync(string userId);

        Task<bool> IsInRoleAsync(string userId, string role);

        Task<List<AdminUserResult>> GetAllUsersAsync();

    }


}
