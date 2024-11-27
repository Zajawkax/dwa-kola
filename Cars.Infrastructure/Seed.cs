using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Cars.Domain;

namespace Cars.Infrastructure
{
    public class Seed
    {
        public static async Task SeedData(DataContext context)
        {
            if (context.Cars.Any()) return;

            var cars = new List<Car>
            {
                new Car
                {
                    Brand = "Mazda",
                    Model = "CX60",
                    DoorsNumber = 5,
                    LuggageCapacity = 570,
                    EngineCapacity = 2488,
                    FuelType = FuelType.Hybrid,
                    ProductionDate = DateTime.UtcNow.AddMonths(-1),
                    CarFuelConsumption = 18.1,
                    BodyType = BodyType.SUV
                },
                new Car
                {
                    Brand = "Toyota",
                    Model = "Corolla",
                    DoorsNumber = 4,
                    LuggageCapacity = 470,
                    EngineCapacity = 1798,
                    FuelType = FuelType.Petrol,
                    ProductionDate = DateTime.UtcNow.AddYears(-2),
                    CarFuelConsumption = 6.5,
                    BodyType = BodyType.Sedan
                },
                new Car
                {
                    Brand = "Ford",
                    Model = "Focus",
                    DoorsNumber = 5,
                    LuggageCapacity = 375,
                    EngineCapacity = 1499,
                    FuelType = FuelType.Diesel,
                    ProductionDate = DateTime.UtcNow.AddYears(-3),
                    CarFuelConsumption = 5.0,
                    BodyType = BodyType.Hatchback
                }
            };

            await context.Cars.AddRangeAsync(cars);
            await context.SaveChangesAsync();
        }
    }
}