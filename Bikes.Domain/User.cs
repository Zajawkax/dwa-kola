using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Bikes.Domain
{
    public class User
    {
        public int UserId { get; set; }

        [Required]
        [MaxLength(50)]
        public string Username { get; set; }

        [Required]
        [MaxLength(100)]
        public string Email { get; set; }

        [Required]
        [MaxLength(255)]
        public string PasswordHash { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;


        [MaxLength(15)]
        public string PhoneNumber { get; set; }

        public bool IsActive { get; set; } = true;

        public bool IsAdmin { get; set; } = false;

        // Nawigacja
        public ICollection<Reservation> Reservations { get; set; }
        public ICollection<Feedback> Feedbacks { get; set; }
        public ICollection<Damage> Damages { get; set; }
    }
}
