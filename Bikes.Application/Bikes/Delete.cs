using System;
using System.Threading;
using System.Threading.Tasks;
using Bikes.Application.Core;
using Bikes.Infrastructure;
using MediatR;

namespace Bikes.Application.Bikes
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
            var bike = await _context.Bikes.FindAsync(new object[] { request.Id }, cancellationToken);

            if (bike == null) return Result<Unit>.Failure("Bike not found.");

            _context.Bikes.Remove(bike);

            var result = await _context.SaveChangesAsync(cancellationToken) > 0;

            if (!result) return Result<Unit>.Failure("Failed to delete the bike.");

            return Result<Unit>.Success(Unit.Value);
        }
    }
}