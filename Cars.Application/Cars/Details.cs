using System;
using System.Threading;
using System.Threading.Tasks;
using Cars.Domain;
using Cars.Infrastructure;
using MediatR;
using Cars.Application.Core;

namespace Cars.Application.Cars
{
    public class DetailsQuery : IRequest<Result<Car>>
    {
        public Guid Id { get; set; }
    }

    public class DetailsHandler : IRequestHandler<DetailsQuery, Result<Car>>
    {
        private readonly DataContext _context;

        public DetailsHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<Result<Car>> Handle(DetailsQuery request, CancellationToken cancellationToken)
        {
            var car = await _context.Cars.FindAsync(new object[] { request.Id }, cancellationToken);

            if (car == null) return Result<Car>.Failure("Car not found.");

            return Result<Car>.Success(car);
        }
    }
}