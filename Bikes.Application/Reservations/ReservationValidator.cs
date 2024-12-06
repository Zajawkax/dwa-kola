using Bikes.Domain;
using FluentValidation;

namespace Bikes.Application.Reservations
{
    public class ReservationValidator : AbstractValidator<Reservation>
    {
        public ReservationValidator()
        {
            RuleFor(x => x.StartDate)
                .NotEmpty().WithMessage("Data rozpoczêcia jest wymagana");
            RuleFor(x => x.EndDate)
            .NotEmpty().WithMessage("Data zakoñczenia jest wymagana");

        }
    }

}