using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Bikes.Application.Core;
using Bikes.Domain;
using Bikes.Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Bikes.Application.Reservations
{
    public class GetUserReservationsQuery : IRequest<Result<List<Reservation>>>
    {
        public int UserId { get; set; }
    }

    public class GetUserReservationsHandler : IRequestHandler<GetUserReservationsQuery, Result<List<Reservation>>>
    {
        private readonly DataContext _context;

        public GetUserReservationsHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<Result<List<Reservation>>> Handle(GetUserReservationsQuery request, CancellationToken cancellationToken)
        {
            var reservations = await _context.Reservations
                .Include(r => r.Bike)
                .Where(r => r.UserId == request.UserId)
                .ToListAsync(cancellationToken);

            return Result<List<Reservation>>.Success(reservations);
        }
    }
}
