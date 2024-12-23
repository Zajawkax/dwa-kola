using Microsoft.EntityFrameworkCore;
using Bikes.Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace Bikes.Infrastructure
{
    public class DataContext : IdentityDbContext<User, IdentityRole<int>, int>
    {
        public DataContext(DbContextOptions<DataContext> options)
             : base(options) { }

        public DbSet<Bike> Bikes { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
        public DbSet<Damage> Damages { get; set; }
        public DbSet<Availability> Availabilities { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Konfiguracja tabeli Users
            modelBuilder.Entity<User>(entity =>
            {
                //entity.Property(e => e.Username).IsRequired().HasMaxLength(50);
                entity.HasKey(e => e.Id); 
                entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
                entity.Property(e => e.PhoneNumber).HasMaxLength(15);

                entity.Property(e => e.CreatedAt)
                      .HasColumnType("datetime")
                      .ValueGeneratedOnAdd();

                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.Property(e => e.IsAdmin).HasDefaultValue(false);

                entity.HasIndex(e => e.Email).IsUnique();
            });



            // Tabela Bikes
            modelBuilder.Entity<Bike>(entity =>
            {
                entity.HasKey(e => e.BikeId);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Size).IsRequired();
                entity.Property(e => e.BikeType).IsRequired();
                entity.Property(e => e.IsElectric).HasDefaultValue(false);
                entity.Property(e => e.HourlyRate).IsRequired().HasColumnType("decimal(10,2)");
                entity.Property(e => e.DailyRate).IsRequired().HasColumnType("decimal(10,2)");
                entity.Property(e => e.AvailabilityStatus).HasDefaultValue(true);
            });

            // Tabela Reservations
            modelBuilder.Entity<Reservation>(entity =>
            {
                entity.HasKey(e => e.ReservationId);
                entity.Property(e => e.StartDate).IsRequired();
                entity.Property(e => e.EndDate).IsRequired();
                entity.Property(e => e.TotalCost).IsRequired().HasColumnType("decimal(10,2)");
                entity.Property(e => e.Status).IsRequired();
                entity.Property(e => e.ReservationTime)
                      .HasColumnType("datetime")
                      .ValueGeneratedOnAdd();
                // Relacja do User
                entity.HasOne(e => e.User)
                      .WithMany(u => u.Reservations)
                      .HasForeignKey(e => e.UserId)
                      .IsRequired(); // Upewnij się, że UserId jest typu string

                // Relacja do Bike
                entity.HasOne(e => e.Bike)
                      .WithMany(b => b.Reservations)
                      .HasForeignKey(e => e.BikeId);
            });

            // Tabela Feedbacks
            modelBuilder.Entity<Feedback>(entity =>
            {
                entity.HasKey(e => e.FeedbackId);
                entity.Property(e => e.Rating).IsRequired();
                entity.Property(e => e.Comment);
                entity.Property(e => e.CreateDate)
                      .HasColumnType("datetime")
                      .ValueGeneratedOnAdd();

                entity.HasOne(e => e.User)
                      .WithMany(u => u.Feedbacks)
                      .HasForeignKey(e => e.UserId)
                      .IsRequired();

                entity.HasOne(e => e.Bike)
                      .WithMany(b => b.Feedbacks)
                      .HasForeignKey(e => e.BikeId);

                entity.HasOne(e => e.Reservation)
                      .WithMany(r => r.Feedbacks)
                      .HasForeignKey(e => e.ReservationId);
            });

            // Tabela Damages
            modelBuilder.Entity<Damage>(entity =>
            {
                entity.HasKey(e => e.DamageId);
                entity.Property(e => e.ReportDate)
                      .HasColumnType("datetime")
                      .ValueGeneratedOnAdd();

                entity.Property(e => e.Description).IsRequired();
                entity.Property(e => e.RepairStatus).IsRequired();

                entity.HasOne(e => e.Bike)
                      .WithMany(b => b.Damages)
                      .HasForeignKey(e => e.BikeId);

                entity.HasOne(e => e.User)
                      .WithMany(u => u.Damages)
                      .HasForeignKey(e => e.UserId)
                      .IsRequired();
            });

            // Tabela Availability
            modelBuilder.Entity<Availability>(entity =>
            {
                entity.HasKey(e => e.AvailabilityId);
                entity.Property(e => e.Date).IsRequired();
                entity.Property(e => e.IsAvailable).HasDefaultValue(true);

                entity.HasOne(e => e.Bike)
                      .WithMany(b => b.Availabilities)
                      .HasForeignKey(e => e.BikeId);
            });

            base.OnModelCreating(modelBuilder);


    }
}
}
