using MediatR;
using Bikes.Application.Core;
using Bikes.Infrastructure;
using Bikes.Domain;
using System.Threading;
using System.Threading.Tasks;

namespace Bikes.Application.Bikes
{
    public class DetailsHandler : IRequestHandler<DetailsQuery, Result<Bike>>
    {
        private readonly DataContext _context;

        public DetailsHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<Result<Bike>> Handle(DetailsQuery request, CancellationToken cancellationToken)
        {
            var bike = await _context.Bikes.FindAsync(request.BikeId);

            if (bike == null)
                return Result<Bike>.Failure("Rower nie został znaleziony.");

            return Result<Bike>.Success(bike);
        }
    }
}
