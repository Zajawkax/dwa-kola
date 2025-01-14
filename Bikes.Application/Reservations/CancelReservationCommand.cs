using Bikes.Application.Core;
using Bikes.Domain;
using Bikes.Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bikes.Application.Reservations
{
    public class CancelReservationCommand : IRequest<Result<Reservation>>
    {
        public int ReservationId { get; set; }
    }

    public class CancelReservationHandler : IRequestHandler<CancelReservationCommand, Result<Reservation>>
    {
        private readonly DataContext _context;

        public CancelReservationHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<Result<Reservation>> Handle(CancelReservationCommand request, CancellationToken cancellationToken)
        {
            var reservation = await _context.Reservations
                .FirstOrDefaultAsync(r => r.ReservationId == request.ReservationId, cancellationToken);

            if (reservation == null)
            {
                return Result<Reservation>.Failure("Rezerwacja nie została znaleziona.");
            }

            reservation.Status = ReservationStatus.Cancelled;

            var result = await _context.SaveChangesAsync(cancellationToken) > 0;

            if (!result)
            {
                return Result<Reservation>.Failure("Nie udało się anulować rezerwacji.");
            }

            return Result<Reservation>.Success(reservation);
        }
    }
}
