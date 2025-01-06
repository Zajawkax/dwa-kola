using Bikes.API.Services;
using Bikes.Domain;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Bikes.API.Controllers
{
    [Route("api/messages")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly MessageService _messageService;

        public MessagesController(MessageService messageService)
        {
            _messageService = messageService;
        }

        // Akcja do wysyłania wiadomości
        [HttpPost]
        public async Task<IActionResult> SendMessage([FromBody] Message message)
        {
            if (string.IsNullOrEmpty(message.Content))
            {
                return BadRequest("Treść wiadomości nie może być pusta.");
            }

            var senderId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value; // Pobranie ID użytkownika z tokenu
            message.SenderId = senderId;
            message.ReceiverId = "Admin"; // Wiadomości zawsze są wysyłane do administratora

            // Przypisujemy datę wysłania
            message.SentDate = DateTime.Now;

            // Wywołanie serwisu do zapisania wiadomości
            await _messageService.SendMessageAsync(message);

            return Ok("Wiadomość została wysłana.");
        }

        // Akcja do pobierania wiadomości dla administratora
        [HttpGet("Admin")]
        public async Task<IActionResult> GetMessagesForAdmin()
        {
            var messages = await _messageService.GetMessagesForAdminAsync();
            return Ok(messages);
        }
    }
}
