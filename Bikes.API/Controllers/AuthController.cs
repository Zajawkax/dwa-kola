using Bikes.Domain;
using Bikes.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using BCrypt;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Bikes.API.Controllers;
using Bikes.Application.Core;
using System.ComponentModel.DataAnnotations;


namespace Bikes.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly TokenService _tokenService;
        private readonly PasswordHasher<User> _passwordHasher;

        // Konstruktor z wstrzyknięciem zależności
        public AuthController(DataContext context, TokenService tokenService, PasswordHasher<User> passwordHasher)
        {
            _context = context;
            _tokenService = tokenService;
            _passwordHasher = passwordHasher;
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            // Sprawdzanie, czy email już istnieje
            if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
                return BadRequest(new { message = "Email już istnieje." });

            // Sprawdzanie, czy nazwa użytkownika już istnieje
            if (await _context.Users.AnyAsync(u => u.UserName == registerDto.Username))
                return BadRequest(new { message = "Nazwa użytkownika już istnieje." });

            // Hashowanie hasła
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

            // Tworzenie nowego użytkownika
            var user = new User
            {
                UserName = registerDto.Username,
                Email = registerDto.Email,
                PasswordHash = passwordHash,
                PhoneNumber = registerDto.PhoneNumber
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Generowanie tokena
            var token = _tokenService.CreateToken(user);

            // Zwracanie odpowiedzi z tokenem i nazwą użytkownika
            return Ok(new
            {
                token,
                username = user.UserName
            });
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == dto.Username);

            if (user == null)
                return Unauthorized("Invalid username");

            // Weryfikacja hasła za pomocą BCrypt
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
            if (!isPasswordValid)
                return Unauthorized("Invalid password");

            // Generowanie tokena
            var token = _tokenService.CreateToken(user);

            return Ok(new { Token = token, Username = user.UserName });
        }
    }

    // DTO dla rejestracji
    public class RegisterDto
    {
        [Required]
        [EmailAddress]
        public string Username { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        public string PhoneNumber { get; set; }
    }

    // DTO dla logowania
    public class LoginDto
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
