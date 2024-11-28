using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Bikes.Domain;

namespace Bikes.Infrastructure
{
    public class Seed
    {
        public static async Task SeedData(DataContext context)
        {
            if (context.Bikes.Any()) return;

            var bikes = new List<Bike>
            {
                new Bike
                {
                    Brand = "Mazda",
                    Model = "CX60",
                    DoorsNumber = 5,
                    LuggageCapacity = 570,
                    EngineCapacity = 2488,
                    FuelType = FuelType.Hybrid,
                    ProductionDate = DateTime.UtcNow.AddMonths(-1),
                    BikeFuelConsumption = 18.1,
                    BodyType = BodyType.SUV
                },
                new Bike
                {
                    Brand = "Toyota",
                    Model = "Corolla",
                    DoorsNumber = 4,
                    LuggageCapacity = 470,
                    EngineCapacity = 1798,
                    FuelType = FuelType.Petrol,
                    ProductionDate = DateTime.UtcNow.AddYears(-2),
                    BikeFuelConsumption = 6.5,
                    BodyType = BodyType.Sedan
                },
                new Bike
                {
                    Brand = "Ford",
                    Model = "Focus",
                    DoorsNumber = 5,
                    LuggageCapacity = 375,
                    EngineCapacity = 1499,
                    FuelType = FuelType.Diesel,
                    ProductionDate = DateTime.UtcNow.AddYears(-3),
                    BikeFuelConsumption = 5.0,
                    BodyType = BodyType.Hatchback
                }
            };

            await context.Bikes.AddRangeAsync(bikes);
            await context.SaveChangesAsync();
        }
    }
}