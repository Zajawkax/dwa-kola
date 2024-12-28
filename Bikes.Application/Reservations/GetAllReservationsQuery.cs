using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Bikes.Application.Core;
using Bikes.Domain;
using Bikes.Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Bikes.Application.Reservations
{
    public class GetAllReservationsQuery : IRequest<Result<List<Reservation>>>
    {
    }

    public class GetAllReservationsHandler : IRequestHandler<GetAllReservationsQuery, Result<List<Reservation>>>
    {
        private readonly DataContext _context;

        public GetAllReservationsHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<Result<List<Reservation>>> Handle(GetAllReservationsQuery request, CancellationToken cancellationToken)
        {
            // pobierz wszystkie rezerwacje
            var reservations = await _context.Reservations
                .Include(r => r.Bike)
                .Include(r => r.User)
                .ToListAsync(cancellationToken);

            return Result<List<Reservation>>.Success(reservations);
        }
    }
}
