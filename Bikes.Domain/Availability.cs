using System;

namespace Bikes.Domain
{
    public class Availability
    {
        public int AvailabilityId { get; set; }
        public int BikeId { get; set; }
        public DateTime Date { get; set; }
        public bool IsAvailable { get; set; }

        // Nawigacja
        public Bike Bike { get; set; }
    }
}
