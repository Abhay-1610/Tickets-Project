using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TicketsProject.Application.Interfaces;
using TicketsProject.Domain.Entities;
using TicketsProject.Infrastructure.Authentication;
using TicketsProject.Infrastructure.Data;
using TicketsProject.Infrastructure.Repositories;
using TicketsProject.Infrastructure.SignalR;

namespace TicketsProject.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // ---------------- DB ----------------
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(
                configuration.GetConnectionString("DefaultConnection")));

        // ---------------- IDENTITY ----------------
        services.AddIdentity<ApplicationUser, IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        // ---------------- JWT ----------------
        services.Configure<JwtSettings>(configuration.GetSection("Jwt"));

        services.AddScoped<JwtTokenService>();
        services.AddScoped<RefreshTokenService>();

        // ---------------- SIGNALR ----------------
        services.AddSignalR();

        // ---------------- REPOSITORIES ----------------
        services.AddScoped<IAuthRepository, AuthRepository>();
        services.AddScoped<ITicketRepository, TicketRepository>();
        services.AddScoped<IMessageRepository, MessageRepository>();
        services.AddScoped<IAuditLogRepository, AuditLogRepository>();

        // ---------------- APP SERVICES ----------------
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddScoped<IRealtimeNotifier, SignalRNotifier>();

        return services;
    }
}
