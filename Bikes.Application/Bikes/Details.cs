using System;
using System.Threading;
using System.Threading.Tasks;
using Bikes.Domain;
using Bikes.Infrastructure;
using MediatR;
using Bikes.Application.Core;

namespace Bikes.Application.Bikes
{
    public class DetailsQuery : IRequest<Result<Bike>>
    {
        public Guid Id { get; set; }
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
            var bike = await _context.Bikes.FindAsync(new object[] { request.Id }, cancellationToken);

            if (bike == null) return Result<Bike>.Failure("Bike not found.");

            return Result<Bike>.Success(bike);
        }
    }
}