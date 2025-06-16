using Domain.Enums;

namespace Application.Models.Responses
{
    public class VehicleDto
    {
        public string LicensePlate { get; set; }
        public string Name { get; set; }
        public string ImagePath { get; set; }
        public string Description { get; set; }
        public VehicleType Type { get; set; }
        public int YearModel { get; set; }
        public int Capacity { get; set; }
        public int Available { get; set; }
        public string From { get; set; }
        public string DriverName { get; set; }
        public EntityState IsActive { get; set; }
    }
}