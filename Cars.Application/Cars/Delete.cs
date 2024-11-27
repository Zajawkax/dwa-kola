using System;
using System.Threading;
using System.Threading.Tasks;
using Cars.Application.Core;
using Cars.Infrastructure;
using MediatR;

namespace Cars.Application.Cars
{
    public class DeleteCommand : IRequest<Result<Unit>>
    {
        public Guid Id { get; set; }
    }

    public class DeleteHandler : IRequestHandler<DeleteCommand, Result<Unit>>
    {
        private readonly DataContext _context;

        public DeleteHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<Result<Unit>> Handle(DeleteCommand request, CancellationToken cancellationToken)
        {
            var car = await _context.Cars.FindAsync(new object[] { request.Id }, cancellationToken);

            if (car == null) return Result<Unit>.Failure("Car not found.");

            _context.Cars.Remove(car);

            var result = await _context.SaveChangesAsync(cancellationToken) > 0;

            if (!result) return Result<Unit>.Failure("Failed to delete the car.");

            return Result<Unit>.Success(Unit.Value);
        }
    }
}