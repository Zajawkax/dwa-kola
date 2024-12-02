using Bikes.Domain;
using FluentValidation;

namespace Bikes.Application.Bikes
{
    public class BikeValidator : AbstractValidator<Bike>
    {
        public BikeValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Nazwa jest wymagana")
                .MaximumLength(100).WithMessage("Nazwa nie może przekraczać 100 znaków");

            RuleFor(x => x.Size)
                .IsInEnum().WithMessage("Rozmiar jest wymagany i musi być poprawny");

            RuleFor(x => x.BikeType)
                .IsInEnum().WithMessage("Typ roweru jest wymagany i musi być poprawny");

            RuleFor(x => x.HourlyRate)
                .GreaterThan(0).WithMessage("Stawka godzinowa musi być większa niż 0");

            RuleFor(x => x.DailyRate)
                .GreaterThan(0).WithMessage("Stawka dzienna musi być większa niż 0");

            RuleFor(x => x.IsElectric)
                .NotNull().WithMessage("Informacja o elektryczności jest wymagana");
        }
    }
}
