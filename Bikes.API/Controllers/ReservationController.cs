using System.Security.Claims;
using System.Threading.Tasks;
using Bikes.Application.Core;
using Bikes.Application.Reservations;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Bikes.Application.Bikes;
using Bikes.Application.Emails;


namespace Bikes.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // wymagamy JWT do wszystkiego poniżej
    public class ReservationController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly EmailService _emailService;

        public ReservationController(IMediator mediator, EmailService emailService)
        {
            _mediator = mediator;
            _emailService = emailService;
        }

        /// <summary>
        /// Pobranie wszystkich rezerwacji (Tylko dla Admina)
        /// GET: /api/Reservation/all
        /// </summary>
        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllReservations()
        {
            var result = await _mediator.Send(new GetAllReservationsQuery());
            if (!result.IsSuccess) return BadRequest(result.Error);

            return Ok(result.Value);
        }

        /// <summary>
        /// Pobranie rezerwacji zalogowanego użytkownika
        /// GET: /api/Reservation/my
        /// </summary>
        [HttpGet("my")]
        public async Task<IActionResult> GetMyReservations()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString)) return Unauthorized();

            // konwersja ID na int
            if (!int.TryParse(userIdString, out var userId)) return Unauthorized("Błędne ID użytkownika.");

            var query = new GetUserReservationsQuery { UserId = userId };
            var result = await _mediator.Send(query);

            if (!result.IsSuccess) return BadRequest(result.Error);

            return Ok(result.Value);
        }
        [HttpGet("bike/{bikeId}")]
        public async Task<IActionResult> GetReservationsForBike(int bikeId)
        {
            var query = new GetReservationsForBikeQuery { BikeId = bikeId };
            var result = await _mediator.Send(query);

            if (!result.IsSuccess)
            {
                // If there are no reservations, the bike is available
                return Ok(new { Available = true });
            }

            return Ok(new { Available = false, Reservations = result.Value });
        }


        [HttpPost("check-availability/{bikeId}")]
        public async Task<IActionResult> CheckBikeAvailability(int bikeId, [FromBody] RentBikeDto dto)
        {
            // Pobieramy wszystkie rezerwacje dla roweru
            var result = await _mediator.Send(new GetReservationsForBikeQuery { BikeId = bikeId });

            if (!result.IsSuccess)
                return BadRequest(result.Error);

            // Sprawdzamy dostępność na podstawie dat
            var reservations = result.Value;

            var isAvailable = reservations.All(r => r.EndDate <= dto.StartDate || r.StartDate >= dto.EndDate);

            if (isAvailable)
            {
                return Ok(new { Available = true });
            }
            else
            {
                return Ok(new { Available = false, Message = "Rower jest niedostępny w tym okresie" });
            }
        }



        /// <summary>
        /// Wypożycz rower (utwórz rezerwację)
        /// POST: /api/Reservation/rent/{bikeId}
        /// Body: { StartDate, EndDate }
        /// </summary>
        [HttpPost("rent/{bikeId}")]
        public async Task<IActionResult> RentBike(int bikeId, [FromBody] RentBikeDto dto)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString)) return Unauthorized();

            if (!int.TryParse(userIdString, out var userId)) return Unauthorized("Błędne ID użytkownika.");

            var bike = await _mediator.Send(new DetailsQuery { BikeId = bikeId });
            if (!bike.IsSuccess) return BadRequest(bike.Error);

            var duration = dto.EndDate - dto.StartDate;
            double totalCost = (duration.TotalDays < 1)
                ? (double)bike.Value.HourlyRate * duration.TotalHours
                : (double)bike.Value.DailyRate * Math.Ceiling(duration.TotalDays);

            var command = new RentBikeCommand
            {
                BikeId = bikeId,
                UserId = userId,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
            };

            var result = await _mediator.Send(command);
            if (!result.IsSuccess) return BadRequest(result.Error);

            var userEmail = User.FindFirstValue(ClaimTypes.Email);
            if (string.IsNullOrEmpty(userEmail)) return Unauthorized("Nie można znaleźć adresu e-mail użytkownika.");

            // Wywołanie metody EmailService z dynamicznymi danymi
            await _emailService.SendEmailAsync(
                userEmail,
                "Potwierdzenie rezerwacji",
                $"Potwierdzenie rezerwacji:\n\nRower: {bike.Value.Name}\nCena: {totalCost:C}\nOd: {dto.StartDate}\nDo: {dto.EndDate}",
                bike.Value.Name,
                dto.StartDate,
                dto.EndDate,
                (decimal)totalCost
            );

            return Ok(result.Value);
        }





        /// <summary>
        /// Zwróć rower (zakończ rezerwację)
        /// POST: /api/Reservation/return/{reservationId}
        /// </summary>
        [HttpPost("return/{reservationId}")]
        public async Task<IActionResult> ReturnBike(int reservationId, [FromBody] ReturnBikeDto dto)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString)) return Unauthorized();

            if (!int.TryParse(userIdString, out var userId))
                return Unauthorized("Błędne ID użytkownika.");

            // tworzymy command, przekazujemy DeleteReservation:
            var command = new ReturnBikeCommand
            {
                ReservationId = reservationId,
                UserId = userId,
                DeleteReservation = dto.DeleteReservation
            };

            var result = await _mediator.Send(command);
            if (!result.IsSuccess) return BadRequest(result.Error);

            return Ok("Rower zwrócony pomyślnie.");
        }
    }

    /// <summary>
    /// DTO do wypożyczenia roweru
    /// </summary>
    public class RentBikeDto
    {
        public System.DateTime StartDate { get; set; }
        public System.DateTime EndDate { get; set; }
    }
    public class ReturnBikeDto
    {
        public bool DeleteReservation { get; set; } = false;
    }



}
