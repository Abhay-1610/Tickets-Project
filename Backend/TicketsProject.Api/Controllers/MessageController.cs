using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketsProject.Application.DTOs.Messages;
using TicketsProject.Application.Features.Messages.Get;
using TicketsProject.Application.Features.Messages.Send;

namespace TicketsProject.Api.Controllers
{
    [ApiController]
    [Route("api/messages")]
    [Authorize]
    public sealed class MessageController : ControllerBase
    {
        private readonly IMediator _mediator;

        public MessageController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // -------- SEND MESSAGE (Customer / Agent) --------
        [HttpPost]
        [Authorize(Roles = "Customer,Agent")]
        public async Task<ActionResult<TicketMessageDto>> Send(
            [FromBody] SendMessageDto dto)
        {
            var result = await _mediator.Send(
                new SendMessageCommand(dto));

            return Ok(result);
        }

        // -------- GET MESSAGES BY TICKET (Customer / Agent / Admin) --------
        [HttpGet("ticket/{ticketId:int}")]
        [Authorize(Roles = "Customer,Agent,Admin")]
        public async Task<ActionResult<List<TicketMessageDto>>> GetByTicket(
            int ticketId)
        {
            var result = await _mediator.Send(
                new GetMessagesByTicketQuery(ticketId));

            return Ok(result);
        }
    }
}
