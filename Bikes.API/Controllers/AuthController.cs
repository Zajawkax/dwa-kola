// Controllers/AuthController.cs
using Bikes.Domain;
using Bikes.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using BCrypt;

namespace Bikes.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly DataContext _context;

        public AuthController(DataContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            // Sprawdzamy, czy email już istnieje
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == registerDto.Email);
            if (existingUser != null)
            {
                return BadRequest("Email już istnieje.");
            }

            // Hashowanie hasła
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

            // Tworzenie nowego użytkownika
            var user = new User
            {
                Username = registerDto.Username,
                Email = registerDto.Email,
                PasswordHash = passwordHash,
                PhoneNumber = registerDto.PhoneNumber
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok("Użytkownik zarejestrowany pomyślnie.");
        }
    }

    // DTO dla rejestracji
    public class RegisterDto
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string PhoneNumber { get; set; }
    }
}
