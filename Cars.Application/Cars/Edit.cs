using System.Threading;
using System.Threading.Tasks;
using Cars.Domain;
using Cars.Infrastructure;
using MediatR;
using FluentValidation;
using Cars.Application.Core;
using System;

namespace Cars.Application.Cars
{
    public class EditCommand : IRequest<Result<Unit>>
    {
        public Guid Id { get; set; }
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


    public class EditCommandValidator : AbstractValidator<EditCommand>
    {
        public EditCommandValidator()
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

    public class EditHandler : IRequestHandler<EditCommand, Result<Unit>>
    {
        private readonly DataContext _context;

        public EditHandler(DataContext context)
        {
            _context = context;
        }

        public async Task<Result<Unit>> Handle(EditCommand request, CancellationToken cancellationToken)
        {
            var car = await _context.Cars.FindAsync(new object[] { request.Id }, cancellationToken);

            if (car == null) return Result<Unit>.Failure("Car not found.");

            car.Brand = request.Brand ?? car.Brand;
            car.Model = request.Model ?? car.Model;
            car.DoorsNumber = request.DoorsNumber;
            car.LuggageCapacity = request.LuggageCapacity;
            car.EngineCapacity = request.EngineCapacity;
            car.FuelType = request.FuelType;
            car.ProductionDate = request.ProductionDate;
            car.CarFuelConsumption = request.CarFuelConsumption;
            car.BodyType = request.BodyType;

            var result = await _context.SaveChangesAsync(cancellationToken) > 0;

            if (!result) return Result<Unit>.Failure("Failed to update car.");

            return Result<Unit>.Success(Unit.Value);
        }

    }
}