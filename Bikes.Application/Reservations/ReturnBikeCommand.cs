using System;
using System.Threading;
using System.Threading.Tasks;
using Bikes.Application.Core;
using Bikes.Domain;
using Bikes.Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Bikes.Application.Reservations
{
    /// <summary>
    /// Komenda do zwrócenia roweru.
    /// </summary>
    public class ReturnBikeCommand : IRequest<Result<bool>>
    {
        public int ReservationId { get; set; }
        public int UserId { get; set; } // Dla weryfikacji, czy to użytkownik jest właścicielem rezerwacji
        public bool DeleteReservation { get; set; } = false; // Czy rezerwacja ma być usunięta
    }

    /// <summary>
    /// Handler obsługujący zwrot roweru.
    /// </summary>
    public class ReturnBikeHandler : IRequestHandler<ReturnBikeCommand, Result<bool>>
    {
        private readonly DataContext _context;

        public ReturnBikeHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<Result<bool>> Handle(ReturnBikeCommand request, CancellationToken cancellationToken)
        {
            // Pobierz rezerwację z powiązanym rowerem
            var reservation = await _context.Reservations
                .Include(r => r.Bike)
                .FirstOrDefaultAsync(r => r.ReservationId == request.ReservationId, cancellationToken);

            if (reservation == null)
            {
                return Result<bool>.Failure("Nie znaleziono rezerwacji.");
            }

            // Weryfikacja, czy użytkownik jest właścicielem rezerwacji
            if (reservation.UserId != request.UserId)
            {
                return Result<bool>.Failure("Nie możesz zakończyć rezerwacji, która nie należy do Ciebie.");
            }

            // Zmiana statusu dostępności roweru
            reservation.Bike.AvailabilityStatus = true;

            if (request.DeleteReservation)
            {
                // Usunięcie rezerwacji z bazy danych
                _context.Reservations.Remove(reservation);
            }
            else
            {
                // Aktualizacja statusu rezerwacji i daty zakończenia
                reservation.Status = ReservationStatus.Completed;
                reservation.EndDate = DateTime.UtcNow;
            }

            // Zapis zmian w bazie danych
            var result = await _context.SaveChangesAsync(cancellationToken) > 0;

            if (!result)
            {
                return Result<bool>.Failure("Nie udało się zwrócić roweru.");
            }

            return Result<bool>.Success(true);
        }
    }
}
