using System.Collections.Generic;

namespace Bikes.Domain
{
    public enum BikeSize { Small, Medium, Large }
    public enum BikeType { Mountain, Road, Hybrid, Electric }

    public class Bike
    {
        public int BikeId { get; set; } // Auto-incremented primary key
        public string Name { get; set; }
        public BikeSize Size { get; set; }
        public BikeType BikeType { get; set; }
        public bool IsElectric { get; set; }
        public decimal HourlyRate { get; set; }
        public decimal DailyRate { get; set; }
        public bool AvailabilityStatus { get; set; }

        // Nawigacja
        public ICollection<Reservation> Reservations { get; set; }
        public ICollection<Feedback> Feedbacks { get; set; }
        public ICollection<Damage> Damages { get; set; }
        public ICollection<Availability> Availabilities { get; set; }
    }
}
