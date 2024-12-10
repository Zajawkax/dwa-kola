using Bikes.Application.Core;
using FluentValidation;
using MediatR;
using Bikes.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bikes.Application.Users;
using Bikes.Infrastructure;

namespace Bikes.Application.Users
{
    public class CreateUser : IRequest<Result<Unit>>
    {
        public string Username {get; set;}
        public string Email { get; set;}
        public string PasswordHash { get; set;}
        public DateTime CreatedAt { get; set;}
        public string PhoneNumber { get; set;}
        public bool IsActive { get; set;}
        public bool IsAdmin { get; set;}
    }

    public class CreateUserValidator : AbstractValidator<CreateUser>
    {
        public CreateUserValidator()
        {
            RuleFor(x => x.Username)
            .NotEmpty().WithMessage("Nazwa użytkownika jest wymagana")
            .MaximumLength(50).WithMessage("Nazwa użytkownika nie może przekraczać 50 znaków");
            
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email jest wymagany")
                .MaximumLength(100).WithMessage("Email nie może przekraczać 100 znaków");

            RuleFor(x => x.PhoneNumber)
                .NotEmpty().WithMessage("Numer telefonu jest wymagany")
                .MaximumLength(15).WithMessage("Numer telefonu nie może przekraczać 15 znaków");

            RuleFor(x => x.PasswordHash)
                .NotEmpty().WithMessage("Hasło jest wymagane")
                .MaximumLength(255).WithMessage("Hasło nie może przekraczać 255 znaków");

        }
    }

    public class CreateUserHandler : IRequestHandler<CreateUser, Result<Unit>>
    {
        private readonly DataContext _context;
        public CreateUserHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<Result<Unit>> Handle(CreateUser request, CancellationToken cancellationToken)
        {
            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                PhoneNumber = request.PhoneNumber,
                PasswordHash = request.PasswordHash,

            };

            _context.Users.Add(user);

            var result = await _context.SaveChangesAsync(cancellationToken) > 0;

            if (!result)
                return Result<Unit>.Failure("Nie udało się utworzyć nowego użytkownika.");

            return Result<Unit>.Success(Unit.Value);
        }
    }
}
