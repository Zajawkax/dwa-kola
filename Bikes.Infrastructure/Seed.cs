using System;
using System.Collections.Generic;
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
                    Name = "Mountain Bike X1",
                    Size = BikeSize.Medium,
                    BikeType = BikeType.Mountain,
                    IsElectric = false,
                    HourlyRate = 15.50m,
                    DailyRate = 100.00m,
                    AvailabilityStatus = true
                },
                new Bike
                {
                    Name = "Electric City Bike E200",
                    Size = BikeSize.Large,
                    BikeType = BikeType.Electric,
                    IsElectric = true,
                    HourlyRate = 20.00m,
                    DailyRate = 130.00m,
                    AvailabilityStatus = true
                },
            };

            await context.Bikes.AddRangeAsync(bikes);
            await context.SaveChangesAsync();
        }
    }
}
