using Microsoft.Extensions.Configuration;
using System.Net.Mail;
using System.IO;
using System.Threading.Tasks;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace Bikes.Application.Emails
{
    public class EmailService
    {
        private readonly string _apiKey;
        private readonly string _templatePath;

        public EmailService(IConfiguration configuration)
        {
            _apiKey = configuration["SendGridApiKey"];
            _templatePath = Path.Combine(Directory.GetCurrentDirectory(), "clientapp", "src", "Styles", "EmailStyle.html"); // Ścieżka do pliku HTML
        }

        public async Task SendEmailAsync(string recipientEmail, string subject, string body, string bikeName, DateTime startDate, DateTime endDate, decimal totalCost)
        {
            var client = new SendGridClient(_apiKey);
            var from = new EmailAddress("dwakolkacontact@gmail.com", "Dwa Kółka");
            var to = new EmailAddress(recipientEmail);

            // Wczytanie zawartości pliku HTML
            string htmlContent = await File.ReadAllTextAsync(_templatePath);

            // Zastąpienie dynamicznych danych w treści HTML
            htmlContent = htmlContent.Replace("{bikeName}", bikeName);
            htmlContent = htmlContent.Replace("{startDate}", startDate.ToString("dd-MM-yyyy HH:mm"));
            htmlContent = htmlContent.Replace("{endDate}", endDate.ToString("dd-MM-yyyy HH:mm"));
            htmlContent = htmlContent.Replace("{totalCost}", totalCost.ToString("C"));

            // Tworzenie wiadomości e-mail z treścią HTML
            var msg = MailHelper.CreateSingleEmail(from, to, subject, body, htmlContent);

            try
            {
                var response = await client.SendEmailAsync(msg);
                if (response.StatusCode == System.Net.HttpStatusCode.Accepted)
                {
                    Console.WriteLine("E-mail został wysłany pomyślnie.");
                }
                else
                {
                    Console.WriteLine($"Błąd podczas wysyłania e-maila. Status: {response.StatusCode}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Wystąpił błąd: {ex.Message}");
            }
        }
    }
}
