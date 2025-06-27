using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infraestructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Province> Provinces { get; set; }
        public DbSet<City> Cities { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<EventVehicle> EventsVehicles { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Review> Reviews { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<User>()
                .HasOne(u => u.City)
                .WithMany()
                .HasForeignKey(u => u.CityId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<User>()
                .HasOne(u => u.Province)
                .WithMany()
                .HasForeignKey(u => u.ProvinceId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Event>()
                .HasOne(e => e.Location)
                .WithMany()
                .HasForeignKey(e => e.LocationId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<City>()
                .HasOne(c => c.Province)
                .WithMany()
                .HasForeignKey(c => c.ProvinceId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Vehicle>()
                .HasOne(v => v.User)
                .WithMany()
                .HasForeignKey(v => v.UserId)
                .OnDelete(DeleteBehavior.SetNull);
            modelBuilder.Entity<EventVehicle>()
                .HasKey(ev => ev.EventVehicleId);

            //modelBuilder.Entity<EventVehicle>()
            //    .Property(ev => ev.Capacity)
            //    .HasDefaultValue(0); 

            modelBuilder.Entity<EventVehicle>()
                .HasOne(ev => ev.Event)
                .WithMany(e => e.EventVehicles)
                .HasForeignKey(ev => ev.EventId);

            modelBuilder.Entity<EventVehicle>()
                .HasOne(ev => ev.Vehicle)
                .WithMany(v => v.EventsVehicles)
                .HasForeignKey(ev => ev.LicensePlate)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Booking>()
                .HasOne(b => b.User)
                .WithMany()
                .HasForeignKey(b => b.UserId);

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.EventVehicle)
                .WithMany()
                .HasForeignKey(b => b.EventVehicleId);

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Payment)
                .WithMany()
                .HasForeignKey(b => b.PaymentId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Review>()
                .HasKey(r => r.ReviewId);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.User)
                .WithMany()
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.EventVehicle)
                .WithMany()
                .HasForeignKey(r => r.EventVehicleId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Review>()
                .HasIndex(r => new { r.UserId, r.EventVehicleId })
                .IsUnique();

            modelBuilder.Entity<Review>()
                .HasIndex(r => r.EventVehicleId);
        }
    }
}