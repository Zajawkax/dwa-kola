/*using System.Threading;
using System.Threading.Tasks;
using Bikes.Domain;
using Bikes.Infrastructure;
using MediatR;
using Bikes.Application.Core;

namespace Bikes.Application.Bikes
{
    public class DetailsQuery : IRequest<Result<Bike>>
    {
        public int BikeId { get; set; } // Zmiana na int i BikeId
    }

    public class DetailsHandler : IRequestHandler<DetailsQuery, Result<Bike>>
    {
        private readonly DataContext _context;

        public DetailsHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<Result<Bike>> Handle(DetailsQuery request, CancellationToken cancellationToken)
        {
            var bike = await _context.Bikes.FindAsync(new object[] { request.BikeId }, cancellationToken);

            if (bike == null) return Result<Bike>.Failure("Nie znaleziono roweru.");

            return Result<Bike>.Success(bike);
        }
    }
}
*/