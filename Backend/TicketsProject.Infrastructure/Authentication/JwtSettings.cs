using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TicketsProject.Infrastructure.Authentication
{
    public class JwtSettings
    {
        public string SecretKey { get; set; } = null!;
        public int ExpiryMinutes { get; set; }
        public int RefreshTokenDays { get; set; }
    }
}
 