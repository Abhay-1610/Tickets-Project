using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketsProject.Application.DTOs.Auth;
using TicketsProject.Application.Features.Auth.Login;
using TicketsProject.Application.Features.Auth.RefreshToken;
using TicketsProject.Application.Features.Auth.Register;

namespace TicketsProject.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AuthController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // -------- LOGIN --------
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<LoginResponseDto>> Login(
            [FromBody] LoginRequestDto request)
        {
            var result = await _mediator.Send(
                new LoginCommand(request));

            return Ok(result);
        }

        // -------- REGISTER CUSTOMER --------
        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register(
            [FromBody] LoginRequestDto request)
        {
            await _mediator.Send(
                new RegisterCustomerCommand(
                    request.Email,
                    request.Password));

            return Ok();
        }

        // -------- REFRESH TOKEN --------
        [HttpPost("refresh")]
        [AllowAnonymous]
        public async Task<ActionResult<LoginResponseDto>> Refresh(
            [FromBody] RefreshTokenRequestDto dto)
        {
            var result = await _mediator.Send(
                new RefreshTokenCommand(dto.RefreshToken));

            return Ok(result);
        }
    }
}
