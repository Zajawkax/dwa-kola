using System.Security.Claims;
using System.Text;
using Bikes.Domain;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

namespace Bikes.API.Controllers
{
    public class TokenService
    {
        private readonly IConfiguration _config;

        // Konstruktor wstrzykujący konfigurację
        public TokenService(IConfiguration config)
        {
            _config = config;
        }

        public string CreateToken(User user)
        {
            // Dodajemy rolę użytkownika, jeśli istnieje
            var claims = new List<Claim> {
        new Claim(ClaimTypes.Name, user.UserName),
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),  // Zmienione na user.Id.ToString()
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Role, user.IsAdmin ? "Admin" : "User") // Dodajemy rolę
    };

            // Pobierz klucz z konfiguracji (upewnij się, że masz to w appsettings.json)
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JwtSettings:TokenKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(7), // Token wygasa po 7 dniach
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

    }
}
