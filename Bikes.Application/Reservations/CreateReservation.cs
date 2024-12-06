using Bikes.Domain;
using Bikes.Infrastructure;
using FluentValidation;
using MediatR;
using Bikes.Application.Core;
using System.Threading;
using System.Threading.Tasks;
using Bikes.Application.Bikes;

namespace Bikes.Application.Reservations
{
    public class CreateReservation : IRequest<Result<Unit>>
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal TotalCost { get; set; }
        public ReservationStatus Status { get; set; }
        public DateTime ReservationTime { get; set; } = DateTime.UtcNow;
    }

    public class CreateReservationValidator : AbstractValidator<CreateReservation>
    {
        public CreateReservationValidator()
        {
            RuleFor(x => x.StartDate)
                .NotEmpty().WithMessage("Data rozpoczęcia jest wymagana");
            RuleFor(x => x.EndDate)
            .NotEmpty().WithMessage("Data zakończenia jest wymagana");
        }
    }
    public class CreateReservationHandler : IRequestHandler<CreateReservation, Result<Unit>>
    {
        private readonly DataContext _context;
        public CreateReservationHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<Result<Unit>> Handle(CreateReservation request, CancellationToken cancellationToken)
        {
            var reservation = new Reservation
            {
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                TotalCost = request.TotalCost,
                Status = ReservationStatus.Pending,
                ReservationTime = request.ReservationTime
            };

            _context.Reservations.Add(reservation);

            var result = await _context.SaveChangesAsync(cancellationToken) > 0;

            if (!result)
                return Result<Unit>.Failure("Nie udało się utworzyć nowego roweru.");

            return Result<Unit>.Success(Unit.Value);
        }
    }
    
}
