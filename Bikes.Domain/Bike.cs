using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Bikes.Domain
{
    public enum BikeSize { Small, Medium, Large }
    public enum BikeType { Mountain, Road, Hybrid, Electric }

    public class Bike
    {
        // Klucz główny
        public int BikeId { get; set; } // Auto-incremented primary key

        // Podstawowe właściwości
        public string Name { get; set; }
        public BikeSize Size { get; set; }
        public BikeType BikeType { get; set; }
        public bool IsElectric { get; set; }
        public decimal HourlyRate { get; set; }
        public decimal DailyRate { get; set; }
        public bool AvailabilityStatus { get; set; }

        // Nawigacja
        [JsonIgnore] // Ignorowanie, aby uniknąć cyklicznych referencji
        public ICollection<Reservation> Reservations { get; set; }

        [JsonIgnore]
        public ICollection<Feedback> Feedbacks { get; set; }

        [JsonIgnore]
        public ICollection<Damage> Damages { get; set; }

        [JsonIgnore]
        public ICollection<Availability> Availabilities { get; set; }
    }
}
