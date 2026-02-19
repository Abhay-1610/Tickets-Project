using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TicketsProject.Application.DTOs.Admin;
using TicketsProject.Application.DTOs.Auth;
using TicketsProject.Application.Interfaces;
using TicketsProject.Domain.Entities;
using TicketsProject.Infrastructure.Authentication;
using TicketsProject.Infrastructure.Data;
using TicketsProject.Infrastructure.Roles;

namespace TicketsProject.Infrastructure.Repositories;

public sealed class AuthRepository : IAuthRepository
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly JwtTokenService _jwtService;
    private readonly RefreshTokenService _refreshTokenService;
    private readonly ApplicationDbContext _db;

    public AuthRepository(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        JwtTokenService jwtService,
        RefreshTokenService refreshTokenService,
        ApplicationDbContext db)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _jwtService = jwtService;
        _refreshTokenService = refreshTokenService;
        _db = db;
    }

    // ---------------- LOGIN ----------------
    public async Task<LoginResponseDto> LoginAsync(LoginRequestDto request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email)
            ?? throw new UnauthorizedAccessException("Invalid credentials");


        if (await _userManager.IsLockedOutAsync(user))
            throw new UnauthorizedAccessException("User Is Blocked");

        var result = await _signInManager.CheckPasswordSignInAsync(
            user, request.Password, false);

        if (!result.Succeeded)
            throw new UnauthorizedAccessException("Invalid credentials");


        var role = (await _userManager.GetRolesAsync(user)).FirstOrDefault()
          ?? throw new UnauthorizedAccessException("User role not found");


        var accessToken = _jwtService.GenerateAccessToken(user.Id, user.Email!, role);

        var refreshToken = _refreshTokenService.GenerateRefreshToken();
        var refreshExpiry = _refreshTokenService.GetExpiryDate();

        // save refresh token
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = refreshExpiry;
        await _userManager.UpdateAsync(user);

        return new LoginResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken
        };
    }

    // ---------------- REFRESH TOKEN ----------------
    public async Task<LoginResponseDto> RefreshTokenAsync(string refreshToken)
    {
        var user = await _userManager.Users.SingleOrDefaultAsync(u => u.RefreshToken == refreshToken)
            ?? throw new UnauthorizedAccessException("Invalid credentials");


        if (user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            throw new UnauthorizedAccessException("Refresh token expired");


        var role = (await _userManager.GetRolesAsync(user)).FirstOrDefault()
           ?? throw new UnauthorizedAccessException("User role not found");


        var newAccessToken = _jwtService.GenerateAccessToken(user.Id, user.Email!, role);

        var newRefreshToken = _refreshTokenService.GenerateRefreshToken();

        // rotate refresh token
        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiryTime = _refreshTokenService.GetExpiryDate();
        await _userManager.UpdateAsync(user);

        return new LoginResponseDto
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken
        };
    }

    // ---------------- REGISTER CUSTOMER ----------------
    public async Task RegisterCustomerAsync(string email, string password)
    {
        var user = new ApplicationUser
        {
            UserName = email,
            Email = email
        };

        var result = await _userManager.CreateAsync(user, password);

        if (!result.Succeeded)
            throw new Exception(result.Errors.First().Description);

        await _userManager.AddToRoleAsync(user, RoleConstants.Customer);
    }

    // ---------------- CREATE AGENT ----------------
    public async Task<AdminUserResult> CreateAgentAsync(string email, string password)
    {
        var user = new ApplicationUser
        {
            UserName = email,
            Email = email
        };

        var result = await _userManager.CreateAsync(user, password);

        if (!result.Succeeded)
            throw new ArgumentException(result.Errors.First().Description);

        await _userManager.AddToRoleAsync(user, RoleConstants.Agent);

        return new AdminUserResult
        {
            UserId = user.Id,
            Email = user.Email!,
            IsBlocked = user.LockoutEnd.HasValue
        };
    }


    // ---------------- BLOCK / UNBLOCK ----------------
    public async Task<AdminUserResult> BlockUserAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId)
            ?? throw new KeyNotFoundException("User not found");

        await _userManager.SetLockoutEndDateAsync(user, DateTimeOffset.MaxValue);

        return new AdminUserResult
        {
            UserId = user.Id,
            Email = user.Email!,
            IsBlocked = true
        };
    }


    public async Task<AdminUserResult> UnblockUserAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId)
            ?? throw new KeyNotFoundException("User not found");

        await _userManager.SetLockoutEndDateAsync(user, null);

        return new AdminUserResult
        {
            UserId = user.Id,
            Email = user.Email!,
            IsBlocked = false
        };
    }



    // ---------------- ROLE CHECK ----------------
    public async Task<bool> IsInRoleAsync(string userId, string role)
    {
        var user = await _userManager.FindByIdAsync(userId);
        return user != null && await _userManager.IsInRoleAsync(user, role);
    }

    public async Task<List<AdminUserResult>> GetAllUsersAsync()
    {
        var users = await _userManager.Users.ToListAsync();

        var result = new List<AdminUserResult>();

        foreach (var user in users)
        {
            // Single role by design
            var role = (await _userManager.GetRolesAsync(user)).Single();

            result.Add(new AdminUserResult
            {
                UserId = user.Id,
                Email = user.Email!,
                IsBlocked =
                    user.LockoutEnd.HasValue &&
                    user.LockoutEnd.Value > DateTimeOffset.UtcNow,
                Role = role
            });
        }

        return result;
    }

}
