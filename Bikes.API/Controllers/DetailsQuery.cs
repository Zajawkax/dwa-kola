using Bikes.Domain;
using MediatR;
using Bikes.Application.Core;
using Bikes.Infrastructure;

namespace Bikes.Application.Bikes
{
    public class DetailsQuery : IRequest<Result<Bike>>
    {
        public int BikeId { get; set; } // Dodaj tę właściwość
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
            var bike = await _context.Bikes.FindAsync(request.BikeId);

            if (bike == null)
                return Result<Bike>.Failure("Rower nie został znaleziony.");

            return Result<Bike>.Success(bike);
        }
    }
}
