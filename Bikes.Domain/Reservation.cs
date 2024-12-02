using System;
using System.Collections.Generic;

namespace Bikes.Domain
{
    public enum ReservationStatus { Pending, Confirmed, Cancelled, Completed }

    public class Reservation
    {
        public int ReservationId { get; set; }
        public int UserId { get; set; }
        public int BikeId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal TotalCost { get; set; }
        public ReservationStatus Status { get; set; }
        public DateTime ReservationTime { get; set; } = DateTime.UtcNow;


        // Nawigacja
        public User User { get; set; }
        public Bike Bike { get; set; }
        public ICollection<Feedback> Feedbacks { get; set; }
    }
}
