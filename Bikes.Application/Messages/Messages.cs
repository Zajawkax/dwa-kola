using Bikes.Domain;
using Microsoft.EntityFrameworkCore;
using Bikes.Infrastructure;

namespace Bikes.API.Services
{
    public class MessageService
    {
        private readonly DataContext _context;

        public MessageService(DataContext context)
        {
            _context = context;
        }

        // Zapisanie wiadomości
        public async Task SendMessageAsync(Message message)
        {
            _context.Messages.Add(message);
            await _context.SaveChangesAsync();
        }

        // Pobranie wiadomości dla administratora
        public async Task<List<Message>> GetMessagesForAdminAsync()
        {
            // Filtrujemy wiadomości, które są wysłane do admina
            return await _context.Messages
                                 .Where(m => m.ReceiverId == "Admin")
                                 .OrderByDescending(m => m.SentDate)
                                 .ToListAsync();
        }
    }
}
