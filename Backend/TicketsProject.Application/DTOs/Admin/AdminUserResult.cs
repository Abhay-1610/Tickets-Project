using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TicketsProject.Application.DTOs.Admin
{
    public class AdminUserResult
    {
        public string UserId { get; init; } = string.Empty;
        public string Email { get; init; } = string.Empty;
        public bool IsBlocked { get; init; }
        public string Role { get; init; } = string.Empty;
    }
}
