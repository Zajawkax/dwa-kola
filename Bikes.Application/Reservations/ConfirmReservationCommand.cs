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

    public class ConfirmReservationCommand : IRequest<Result<Reservation>>
    {
        public int ReservationId { get; set; }
    }

    public class ConfirmReservationHandler : IRequestHandler<ConfirmReservationCommand, Result<Reservation>>
    {
        private readonly DataContext _context;

        public ConfirmReservationHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<Result<Reservation>> Handle(ConfirmReservationCommand request, CancellationToken cancellationToken)
        {

            var reservation = await _context.Reservations
                .FirstOrDefaultAsync(r => r.ReservationId == request.ReservationId, cancellationToken);

            if (reservation == null)
            {
                return Result<Reservation>.Failure("Rezerwacja nie została znaleziona.");
            }

            reservation.Status = ReservationStatus.Confirmed;

 
            var result = await _context.SaveChangesAsync(cancellationToken) > 0;

            if (!result)
            {
                return Result<Reservation>.Failure("Nie udało się potwierdzić rezerwacji.");
            }

            return Result<Reservation>.Success(reservation);
        }
    }
}
