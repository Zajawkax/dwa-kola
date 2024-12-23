using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Bikes.Domain
{
    public class User : IdentityUser<int>
    {
        //public int Id { get; set; }
        //public int UserId { get; set; }
        [Required]
        [MaxLength(50)]
        public override string UserName { get; set; }

        [Required]
        [MaxLength(100)]
        public string Email { get; set; }

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
