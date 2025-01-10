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
            // Zmieniono z UserName na Email
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null)
                return Unauthorized("Nieprawidłowy email");

            // Weryfikacja hasła za pomocą BCrypt
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
            if (!isPasswordValid)
                return Unauthorized("Nieprawidłowe hasło");

            // Generowanie tokena
            var token = _tokenService.CreateToken(user);

            return Ok(new { Token = token, Username = user.UserName });
        }


        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            // Pobranie emaila użytkownika z tokena JWT
            var username = User.Identity?.Name;

            if (string.IsNullOrEmpty(username))
            {
                return Unauthorized("Użytkownik nie jest uwierzytelniony.");
            }

            // Pobranie użytkownika z bazy danych na podstawie emaila z tokenu
            var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.UserName == username);

            if (user == null)
            {
                return NotFound("Nie znaleziono użytkownika.");
            }

            // Przygotowanie odpowiedzi z profilem użytkownika
            var userProfile = new
            {
                Username = user.UserName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber
            };

            return Ok(userProfile);
        }

        [HttpPost("change-password-login")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            var username = User.Identity?.Name;

            if (string.IsNullOrEmpty(username))
            {
                return Unauthorized("Użytkownik nie jest uwierzytelniony.");
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == username);

            if (user == null)
            {
                return NotFound("Nie znaleziono użytkownika.");
            }

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash);
            if (!isPasswordValid)
            {
                return BadRequest("Podane obecne hasło jest nieprawidłowe.");
            }

            var newPasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);

            user.PasswordHash = newPasswordHash;

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return Ok("Hasło zostało pomyślnie zmienione.");
        }
       




        // DTO dla rejestracji
        public class RegisterDto
        {
            [Required]

            public string Username { get; set; }
            [Required]
            [EmailAddress]
            public string Email { get; set; }
            [Required]
            public string Password { get; set; }
            [Required]
            public string PhoneNumber { get; set; }
        }
        [HttpDelete("delete-account")]
        [Authorize]
        public async Task<IActionResult> DeleteAccount()
        {
            var username = User.Identity?.Name;

            if (string.IsNullOrEmpty(username))
            {
                return Unauthorized("Użytkownik nie jest uwierzytelniony.");
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == username);

            if (user == null)
            {
                return NotFound("Nie znaleziono użytkownika.");
            }

            // Usunięcie użytkownika
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok("Konto zostało usunięte.");
        }

        // DTO dla logowania
        public class LoginDto
        {
            [Required]
            [EmailAddress]
            public string Email { get; set; }
            [Required]
            public string Password { get; set; }
        }

        public class ChangePasswordDto
        {
            [Required]
            public string CurrentPassword { get; set; }

            [Required]
            [MinLength(6, ErrorMessage = "Nowe hasło musi mieć co najmniej 6 znaków.")]
            public string NewPassword { get; set; }
        }
    }
}
