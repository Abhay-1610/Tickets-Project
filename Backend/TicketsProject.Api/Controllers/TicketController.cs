using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketsProject.Application.DTOs.Tickets;
using TicketsProject.Application.Features.Tickets.Assign;
using TicketsProject.Application.Features.Tickets.AssignSecondary;
using TicketsProject.Application.Features.Tickets.ConfirmResolution;
using TicketsProject.Application.Features.Tickets.Create;
using TicketsProject.Application.Features.Tickets.Get;
using TicketsProject.Application.Features.Tickets.RequestConfirmation;
using TicketsProject.Application.Features.Tickets.Status;

namespace TicketsProject.Api.Controllers
{
    [ApiController]
    [Route("api/tickets")]
    [Authorize]
    public class TicketController : ControllerBase
    {
        private readonly IMediator _mediator;

        public TicketController(IMediator mediator)
        { 
            _mediator = mediator;
        }

        // -------- CREATE TICKET (Customer) --------
        [HttpPost]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> Create(
            [FromBody] CreateTicketDto dto)
        {
            var ticketId = await _mediator.Send(new CreateTicketCommand(dto));

            // return full detail for redux insert
            var ticket = await _mediator.Send(
                new GetTicketDetailQuery(ticketId));

            return Ok(ticket);
        }


        // -------- GET MY TICKETS (Customer) --------
        [HttpGet("my")]
        [Authorize(Roles = "Agent,Customer")]
        public async Task<IActionResult> GetMyTickets()
        {
            var result = await _mediator.Send(new GetMyTicketsQuery());
            return Ok(result);
        }

        // -------- GET ALL TICKETS (Agent/Admin) --------
        [HttpGet]
        [Authorize(Roles = "Agent,Admin")]
        public async Task<IActionResult> GetTickets()
        {
            var result = await _mediator.Send(new GetTicketsQuery());
            return Ok(result);
        }

        // -------- GET TICKET DETAIL by ID--------
        [HttpGet("{ticketId:int}")]
        public async Task<IActionResult> GetDetail(int ticketId)
        {
            var result = await _mediator.Send(
                new GetTicketDetailQuery(ticketId));

            return Ok(result);
        }

        // -------- ASSIGN AGENT --------
        [HttpPost("{ticketId:int}/assign")]
        [Authorize(Roles = "Agent,Admin")]
        public async Task<IActionResult> Assign(int ticketId)
        {
            await _mediator.Send(new AssignAgentCommand(ticketId));

            var ticket = await _mediator.Send(
       new GetTicketDetailQuery(ticketId));

            return Ok(ticket);
        }

        [HttpPost("{ticketId:int}/assign-secondary")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AssignSecondary(
    int ticketId,
    [FromBody] AssignSecondaryAgentRequest request)
        {
            await _mediator.Send(
                new AssignSecondaryAgentCommand(ticketId, request.AgentId));

            var ticket = await _mediator.Send(
                new GetTicketDetailQuery(ticketId));

            return Ok(ticket);
        }



        // -------- UPDATE STATUS --------
        [HttpPut("{ticketId:int}/status")]
        [Authorize(Roles = "Agent")]
        public async Task<IActionResult> UpdateStatus(
            int ticketId,
            [FromBody] UpdateTicketStatusDto dto)
        {
            await _mediator.Send(
                new UpdateTicketStatusCommand(ticketId, dto.Status));

            var ticket = await _mediator.Send(
                new GetTicketDetailQuery(ticketId));

            return Ok(ticket);
        }



        // -------- CONFIRM RESOLUTION --------
        [HttpPost("{ticketId}/confirm")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> ConfirmResolution(
            int ticketId,
            [FromBody] bool isResolved)
        {
            await _mediator.Send(
                new ConfirmTicketResolutionCommand(ticketId, isResolved));

            var ticket = await _mediator.Send(
                new GetTicketDetailQuery(ticketId));

            return Ok(ticket);
        }

        [HttpPost("{ticketId}/request-confirmation")]
        [Authorize(Roles = "Agent")]
        public async Task<IActionResult> RequestConfirmation(int ticketId)
        {
            await _mediator.Send(
                new RequestTicketConfirmationCommand(ticketId));

            return NoContent();
        }

    }
}
