using Microsoft.Extensions.Options;
using System.Security.Cryptography;

namespace TicketsProject.Infrastructure.Authentication;

public sealed class RefreshTokenService
{
    private readonly JwtSettings _settings;

    public RefreshTokenService(IOptions<JwtSettings> options)
    {
        _settings = options.Value;
    }

    // Secure random refresh token
    public string GenerateRefreshToken()
    {
        var bytes = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(bytes);

        return Convert.ToBase64String(bytes);
    }

    // Centralized expiry rule
    public DateTime GetExpiryDate()
    {
        return DateTime.UtcNow.AddDays(_settings.RefreshTokenDays);
    }
}
