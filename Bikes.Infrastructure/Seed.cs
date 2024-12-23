using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Bikes.Domain;
using Microsoft.AspNetCore.Identity;

namespace Bikes.Infrastructure
{
    public class Seed
    {
        public static async Task SeedData(DataContext context, UserManager<User> userManager)
        {
            if (!userManager.Users.Any())
            {
                var users = new List<User>
                {
                    new User
                    {
                        UserName = "admin",
                        Email = "admin@example.com",
                        PhoneNumber = "111111111",
                        IsAdmin = true
                    },
                    new User
                    {
                        UserName = "user",
                        Email = "mail",
                        PhoneNumber = "222222222",
                        IsAdmin = false
                    }
                };

                foreach (var user in users)
                {
                    await userManager.CreateAsync(user, "Zaq12wsx");
                }
            }

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
