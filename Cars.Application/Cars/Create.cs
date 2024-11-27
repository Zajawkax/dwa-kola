using Cars.Domain;
using Cars.Infrastructure;
using FluentValidation;
using MediatR;
using Cars.Application.Core;

namespace Cars.Application.Cars
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
        public double CarFuelConsumption { get; set; }
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
            RuleFor(x => x.CarFuelConsumption).GreaterThan(0).WithMessage("Car fuel consumption must be greater than 0");
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
            var car = new Car
            {
                Id = Guid.NewGuid(),
                Brand = request.Brand,
                Model = request.Model,
                DoorsNumber = request.DoorsNumber,
                LuggageCapacity = request.LuggageCapacity,
                EngineCapacity = request.EngineCapacity,
                FuelType = request.FuelType,
                ProductionDate = request.ProductionDate,
                CarFuelConsumption = request.CarFuelConsumption,
                BodyType = request.BodyType
            };

            _context.Cars.Add(car);

            var result = await _context.SaveChangesAsync(cancellationToken) > 0;

            if (!result) return Result<Unit>.Failure("Failed to create car.");

            return Result<Unit>.Success(Unit.Value);
        }

    }
}