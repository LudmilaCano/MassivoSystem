using System.ComponentModel.DataAnnotations;
using Domain.Enums;

namespace Domain.Entities
{
    public class Vehicle
    {
        [Key]
        public string LicensePlate { get; set; }
        public int? UserId { get; set; }
        public User User { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ImagePath { get; set; }
        public string DriverName { get; set; }
        public VehicleType Type { get; set; }
        public int YearModel { get; set; }
        public int Capacity { get; set; }
        public int Available { get; set; }
        public EntityState IsActive { get; set; } = EntityState.Active;
    }
}