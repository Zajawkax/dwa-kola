using MediatR;
using Bikes.Application.Core;
using Bikes.Infrastructure;

namespace Bikes.Application.Bikes
{
    public class DeleteCommand : IRequest<Result<Unit>>
    {
        public int BikeId { get; set; } // Dodaj tę właściwość
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
            var bike = await _context.Bikes.FindAsync(request.BikeId);

            if (bike == null)
                return Result<Unit>.Failure("Rower nie został znaleziony.");

            _context.Bikes.Remove(bike);

            var result = await _context.SaveChangesAsync(cancellationToken) > 0;

            if (!result)
                return Result<Unit>.Failure("Nie udało się usunąć roweru.");

            return Result<Unit>.Success(Unit.Value);
        }
    }
}
