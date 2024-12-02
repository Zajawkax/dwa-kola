using Bikes.Domain;
using Bikes.Infrastructure;
using FluentValidation;
using MediatR;
using Bikes.Application.Core;
using System.Threading;
using System.Threading.Tasks;

namespace Bikes.Application.Bikes
{
    public class CreateCommand : IRequest<Result<Unit>>
    {
        public string Name { get; set; }
        public BikeSize Size { get; set; }
        public BikeType BikeType { get; set; }
        public bool IsElectric { get; set; }
        public decimal HourlyRate { get; set; }
        public decimal DailyRate { get; set; }
        public bool AvailabilityStatus { get; set; }
    }

    public class CreateCommandValidator : AbstractValidator<CreateCommand>
    {
        public CreateCommandValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Nazwa jest wymagana")
                .MaximumLength(100).WithMessage("Nazwa nie może przekraczać 100 znaków");

            RuleFor(x => x.Size)
                .IsInEnum().WithMessage("Rozmiar jest wymagany");

            RuleFor(x => x.BikeType)
                .IsInEnum().WithMessage("Typ roweru jest wymagany");

            RuleFor(x => x.HourlyRate)
                .GreaterThan(0).WithMessage("Stawka godzinowa musi być większa niż 0");

            RuleFor(x => x.DailyRate)
                .GreaterThan(0).WithMessage("Stawka dzienna musi być większa niż 0");

            RuleFor(x => x.IsElectric)
                .NotNull().WithMessage("Informacja o elektryczności jest wymagana");
        }
    }

    public class CreateHandler : IRequestHandler<CreateCommand, Result<Unit>>
    {
        private readonly DataContext _context;

        public CreateHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<Result<Unit>> Handle(CreateCommand request, CancellationToken cancellationToken)
        {
            var bike = new Bike
            {
                Name = request.Name,
                Size = request.Size,
                BikeType = request.BikeType,
                IsElectric = request.IsElectric,
                HourlyRate = request.HourlyRate,
                DailyRate = request.DailyRate,
                AvailabilityStatus = request.AvailabilityStatus
            };

            _context.Bikes.Add(bike);

            var result = await _context.SaveChangesAsync(cancellationToken) > 0;

            if (!result)
                return Result<Unit>.Failure("Nie udało się utworzyć nowego roweru.");

            return Result<Unit>.Success(Unit.Value);
        }
    }
}
