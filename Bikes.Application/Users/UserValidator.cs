using Bikes.Domain;
using FluentValidation;

namespace Bikes.Application.Users
{
    public class UserValidator : AbstractValidator<User>
    {
        public UserValidator()
        {
            RuleFor(x => x.Username)
                .NotEmpty().WithMessage("Nazwa u�ytkownika jest wymagana")
                .MaximumLength(50).WithMessage("Nazwa u�ytkownika nie mo�e przekracza� 50 znak�w");
            
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email jest wymagany")
                .MaximumLength(100).WithMessage("Email nie mo�e przekracza� 100 znak�w");

            RuleFor(x => x.PhoneNumber)
                .NotEmpty().WithMessage("Numer telefonu jest wymagany")
                .MaximumLength(15).WithMessage("Numer telefonu nie mo�e przekracza� 15 znak�w");

            RuleFor(x => x.PasswordHash)
                .NotEmpty().WithMessage("Has�o jest wymagane")
                .MaximumLength(255).WithMessage("Has�o nie mo�e przekracza� 255 znak�w");

        }
    }
}