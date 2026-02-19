using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TicketsProject.Application.DTOs.Messages;
using TicketsProject.Domain.Entities;

namespace TicketsProject.Application.Interfaces
{
    public interface IMessageRepository
    {
        Task AddAsync(TicketMessage message);              // save message
        Task<List<TicketMessageDto>> GetByTicketDtoAsync(int ticketId); // chat history

        //Task AddAttachmentsAsync(int messageId, List<string> imageUrls);
    }

}
