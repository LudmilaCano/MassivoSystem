// Application/Models/Requests/AdminVehicleUpdateRequest.cs
using Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace Application.Models.Requests
{
    public class AdminVehicleUpdateRequest
    {
        [Required]
        public string LicensePlate { get; set; }

        [Required]
        public string Name { get; set; }

        public string Description { get; set; }

        [Required]
        public int Capacity { get; set; }

        [Required]
        public VehicleType Type { get; set; }

        public string DriverName { get; set; }

        public int YearModel { get; set; }

        public string ImagePath { get; set; }

        public int Available { get; set; }

        //public string From { get; set; }
    }
}

