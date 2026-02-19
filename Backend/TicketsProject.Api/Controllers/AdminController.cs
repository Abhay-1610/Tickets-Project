using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketsProject.Application.Features.Admin.BlockUser;
using TicketsProject.Application.Features.Admin.CreateAgent;
using TicketsProject.Application.Features.Admin.GetAllUsers;
using TicketsProject.Application.Features.Admin.UnblockUser;
using TicketsProject.Application.Features.AuditLogs;

namespace TicketsProject.Api.Controllers
{
    [ApiController]
    [Route("api/admin")] 
    [Authorize(Roles = "Admin")]
    public sealed class AdminController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AdminController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("users")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _mediator.Send(new GetAllUsersQuery());
            return Ok(users);
        }

        [HttpPost("agents")]
        public async Task<IActionResult> CreateAgent([FromBody] CreateAgentRequest request)
        {
            var result = await _mediator.Send(
                new CreateAgentCommand(request.Email, request.Password));

            return Ok(result);
        }


        // -------- BLOCK USER --------
        [HttpPost("users/{userId}/block")]
        public async Task<IActionResult> BlockUser(string userId)
        {
            var result = await _mediator.Send(new BlockUserCommand(userId));
            return Ok(result);
        }


        // -------- UNBLOCK USER --------
        [HttpPost("users/{userId}/unblock")]
        public async Task<IActionResult> UnblockUser(string userId)
        {
            var result = await _mediator.Send(new UnblockUserCommand(userId));
            return Ok(result);
        }

        // -------- AUDIT LOGS --------

        [HttpGet("audit-logs")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAuditLogs()
        {
            var logs = await _mediator.Send(new GetAuditLogsQuery());
            return Ok(logs);
        }

    }

    // simple request DTO for agent creation
    public sealed class CreateAgentRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
