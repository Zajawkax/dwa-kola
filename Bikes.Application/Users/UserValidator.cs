using Bikes.Domain;
using FluentValidation;

namespace Bikes.Application.Users
{
    public class UserValidator : AbstractValidator<User>
    {
        public UserValidator()
        {
            RuleFor(x => x.Username)
                .NotEmpty().WithMessage("Nazwa u¿ytkownika jest wymagana")
                .MaximumLength(50).WithMessage("Nazwa u¿ytkownika nie mo¿e przekraczaæ 50 znaków");
            
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email jest wymagany")
                .MaximumLength(100).WithMessage("Email nie mo¿e przekraczaæ 100 znaków");

            RuleFor(x => x.PhoneNumber)
                .NotEmpty().WithMessage("Numer telefonu jest wymagany")
                .MaximumLength(15).WithMessage("Numer telefonu nie mo¿e przekraczaæ 15 znaków");

            RuleFor(x => x.PasswordHash)
                .NotEmpty().WithMessage("Has³o jest wymagane")
                .MaximumLength(255).WithMessage("Has³o nie mo¿e przekraczaæ 255 znaków");

        }
    }
}