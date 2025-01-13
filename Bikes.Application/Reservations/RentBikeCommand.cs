using System;
using System.Threading;
using System.Threading.Tasks;
using Bikes.Application.Core;
using Bikes.Domain;
using Bikes.Infrastructure; // jeśli używasz EF w Infrastructure
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Bikes.Application.Reservations
{
    public class RentBikeCommand : IRequest<Result<Reservation>>
    {
        public int BikeId { get; set; }
        public int UserId { get; set; }

        // ewentualnie można przekazać StartDate, EndDate
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public double TotalCost { get; set; }
    }

    public class RentBikeHandler : IRequestHandler<RentBikeCommand, Result<Reservation>>
    {
        private readonly DataContext _context;

        public RentBikeHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<Result<Reservation>> Handle(RentBikeCommand request, CancellationToken cancellationToken)
        {
            // Sprawdź, czy rower istnieje i jest dostępny
            var bike = await _context.Bikes
                .FirstOrDefaultAsync(b => b.BikeId == request.BikeId, cancellationToken);

            if (bike == null)
                return Result<Reservation>.Failure("Nie znaleziono roweru.");

            if (!bike.AvailabilityStatus)
                return Result<Reservation>.Failure("Ten rower jest obecnie niedostępny.");

            // Utworzenie nowej rezerwacji
            var reservation = new Reservation
            {
                BikeId = request.BikeId,
                UserId = request.UserId,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                TotalCost = (decimal)request.TotalCost,
                Status = ReservationStatus.Pending, // od razu potwierdzamy
            };

            // Zapis do bazy
            _context.Reservations.Add(reservation);

            var result = await _context.SaveChangesAsync(cancellationToken) > 0;

            if (!result)
                return Result<Reservation>.Failure("Nie udało się utworzyć rezerwacji.");

            return Result<Reservation>.Success(reservation);
        }
    }
}
