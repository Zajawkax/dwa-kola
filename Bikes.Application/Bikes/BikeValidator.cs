using Bikes.Application.Core;
using Bikes.Domain;
using Bikes.Infrastructure;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Bikes.Application.Bikes
{
    public class BikeValidator : AbstractValidator<Bike>
    {
        public BikeValidator()
        {
            RuleFor(x => x.Brand)
                .NotEmpty().WithMessage("Brand is required");

            RuleFor(x => x.Model)
                .NotEmpty().WithMessage("Model is required");

            RuleFor(x => x.DoorsNumber)
                .NotEmpty().WithMessage("Doors number is required")
                .InclusiveBetween(2, 10).WithMessage("Doors number must be between 2 and 10");

            RuleFor(x => x.LuggageCapacity)
                .NotEmpty().WithMessage("Luggage capacity is required");

            RuleFor(x => x.EngineCapacity)
                .NotEmpty().WithMessage("Engine capacity is required");

            RuleFor(x => x.FuelType)
                .NotEmpty().WithMessage("Fuel type is required");

            RuleFor(x => x.ProductionDate)
                .NotEmpty().WithMessage("Production date is required");

            RuleFor(x => x.BikeFuelConsumption)
                .NotEmpty().WithMessage("Bike fuel consumption is required")
                .GreaterThan(0).WithMessage("Bike fuel consumption must be greater than 0");

            RuleFor(x => x.BodyType)
                .NotEmpty().WithMessage("Body type is required");
        }
    }
}


