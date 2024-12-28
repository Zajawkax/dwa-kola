using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Bikes.Domain
{
    public enum ReservationStatus { Pending, Confirmed, Cancelled, Completed }

    public class Reservation
    {
        // Klucz główny
        public int ReservationId { get; set; }

        // Klucze obce
        public int UserId { get; set; }
        public int BikeId { get; set; }

        // Szczegóły rezerwacji
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal TotalCost { get; set; }
        public ReservationStatus Status { get; set; }
        public DateTime ReservationTime { get; set; } = DateTime.UtcNow;

        // Nawigacja
        [JsonIgnore] // Ignorujemy, by nie było cyklicznych referencji
        public User User { get; set; }

        [JsonIgnore]
        public Bike Bike { get; set; }

        [JsonIgnore]
        public ICollection<Feedback> Feedbacks { get; set; }
    }
}
