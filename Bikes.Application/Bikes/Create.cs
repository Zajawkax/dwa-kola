using Bikes.Domain;
using Bikes.Infrastructure;
using FluentValidation;
using MediatR;
using Bikes.Application.Core;

namespace Bikes.Application.Bikes
{
    public class CreateCommand : IRequest<Result<Unit>>
    {
        public string Brand { get; set; }
        public string Model { get; set; }
        public int DoorsNumber { get; set; }
        public int LuggageCapacity { get; set; }
        public int EngineCapacity { get; set; }
        public FuelType FuelType { get; set; }
        public DateTime ProductionDate { get; set; }
        public double BikeFuelConsumption { get; set; }
        public BodyType BodyType { get; set; }
    }

    public class CreateCommandValidator : AbstractValidator<CreateCommand>
    {
        public CreateCommandValidator()
        {
            RuleFor(x => x.Brand).NotEmpty().WithMessage("Brand is required");
            RuleFor(x => x.Model).NotEmpty().WithMessage("Model is required");
            RuleFor(x => x.DoorsNumber).InclusiveBetween(2, 10).WithMessage("Doors number must be between 2 and 10");
            RuleFor(x => x.LuggageCapacity).GreaterThan(0).WithMessage("Luggage capacity must be greater than 0");
            RuleFor(x => x.EngineCapacity).GreaterThan(0).WithMessage("Engine capacity must be greater than 0");
            RuleFor(x => x.FuelType).IsInEnum().WithMessage("Fuel type is required");
            RuleFor(x => x.ProductionDate).NotEmpty().WithMessage("Production date is required");
            RuleFor(x => x.BikeFuelConsumption).GreaterThan(0).WithMessage("Bike fuel consumption must be greater than 0");
            RuleFor(x => x.BodyType).IsInEnum().WithMessage("Body type is required");
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
                Id = Guid.NewGuid(),
                Brand = request.Brand,
                Model = request.Model,
                DoorsNumber = request.DoorsNumber,
                LuggageCapacity = request.LuggageCapacity,
                EngineCapacity = request.EngineCapacity,
                FuelType = request.FuelType,
                ProductionDate = request.ProductionDate,
                BikeFuelConsumption = request.BikeFuelConsumption,
                BodyType = request.BodyType
            };

            _context.Bikes.Add(bike);

            var result = await _context.SaveChangesAsync(cancellationToken) > 0;

            if (!result) return Result<Unit>.Failure("Failed to create bike.");

            return Result<Unit>.Success(Unit.Value);
        }

    }
}