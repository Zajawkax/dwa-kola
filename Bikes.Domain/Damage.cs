using System;

namespace Bikes.Domain
{
    public enum RepairStatus { Reported, InProgress, Repaired }

    public class Damage
    {
        public int DamageId { get; set; }
        public int BikeId { get; set; }
        public int UserId { get; set; }
        public DateTime ReportDate { get; set; } = DateTime.UtcNow;
        public string Description { get; set; }
        public RepairStatus RepairStatus { get; set; }

        // Nawigacja
        public Bike Bike { get; set; }
        public User User { get; set; }
    }
}
