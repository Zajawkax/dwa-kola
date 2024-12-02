using System.Threading;
using System.Threading.Tasks;
using Bikes.Domain;
using Bikes.Infrastructure;
using MediatR;
using FluentValidation;
using Bikes.Application.Core;

namespace Bikes.Application.Bikes
{
    public class EditCommand : IRequest<Result<Unit>>
    {
        public int BikeId { get; set; }
        public string Name { get; set; }
        public BikeSize? Size { get; set; }
        public BikeType? BikeType { get; set; }
        public bool? IsElectric { get; set; }
        public decimal? HourlyRate { get; set; }
        public decimal? DailyRate { get; set; }
        public bool? AvailabilityStatus { get; set; }
    }

    public class EditCommandValidator : AbstractValidator<EditCommand>
    {
        public EditCommandValidator()
        {
            RuleFor(x => x.BikeId)
                .NotEmpty().WithMessage("ID roweru jest wymagane");

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Nazwa jest wymagana")
                .MaximumLength(100).WithMessage("Nazwa nie może przekraczać 100 znaków");

            // Opcjonalnie można dodać walidacje dla innych właściwości, jeśli są wymagane
        }
    }

    public class EditHandler : IRequestHandler<EditCommand, Result<Unit>>
    {
        private readonly DataContext _context;

        public EditHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<Result<Unit>> Handle(EditCommand request, CancellationToken cancellationToken)
        {
            var bike = await _context.Bikes.FindAsync(new object[] { request.BikeId }, cancellationToken);

            if (bike == null)
                return Result<Unit>.Failure("Rower nie został znaleziony.");

            bike.Name = request.Name ?? bike.Name;
            bike.Size = request.Size ?? bike.Size;
            bike.BikeType = request.BikeType ?? bike.BikeType;
            bike.IsElectric = request.IsElectric ?? bike.IsElectric;
            bike.HourlyRate = request.HourlyRate ?? bike.HourlyRate;
            bike.DailyRate = request.DailyRate ?? bike.DailyRate;
            bike.AvailabilityStatus = request.AvailabilityStatus ?? bike.AvailabilityStatus;

            var result = await _context.SaveChangesAsync(cancellationToken) > 0;

            if (!result)
                return Result<Unit>.Failure("Nie udało się zaktualizować roweru.");

            return Result<Unit>.Success(Unit.Value);
        }
    }
}
