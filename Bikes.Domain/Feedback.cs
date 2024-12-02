using System;

namespace Bikes.Domain
{
    public class Feedback
    {
        public int FeedbackId { get; set; }
        public int UserId { get; set; }
        public int BikeId { get; set; }
        public int ReservationId { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
        public DateTime CreateDate { get; set; } = DateTime.UtcNow;

        // Nawigacja
        public User User { get; set; }
        public Bike Bike { get; set; }
        public Reservation Reservation { get; set; }
    }
}
