using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

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

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

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

            modelBuilder.Entity<EventVehicle>()
                .HasOne(ev => ev.Event)
                .WithMany(e => e.EventVehicles)
                .HasForeignKey(ev => ev.EventId);

            modelBuilder.Entity<EventVehicle>()
             .HasOne(ev => ev.Vehicle)
             .WithMany(v => v.EventsVehicles)
             .HasForeignKey(ev => ev.LicensePlate)
             .OnDelete(DeleteBehavior.Cascade);
        }
    }
}

