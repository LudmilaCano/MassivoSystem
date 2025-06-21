using Domain.Entities;
using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Responses
{
    public class EventVehicleDto
    {
        public int EventVehicleId { get; set; }
        public int EventId { get; set; }
        public string LicensePlate { get; set; }
        public DateTime Date { get; set; }
        public int Occupation { get; set; }
        public string Description { get; set; }
        public int Price { get; set; }
        public string VehicleType { get; set; }
        public string? From { get; set; }
        public VehicleDto Vehicle { get; set; }

        public static EventVehicleDto Create(EventVehicle eventVehicleEntity)
        {
            return new EventVehicleDto
            {
                EventVehicleId = eventVehicleEntity.EventVehicleId,
                EventId = eventVehicleEntity.EventId,
                LicensePlate = eventVehicleEntity.LicensePlate,
                Date = eventVehicleEntity.Date,
                Occupation = eventVehicleEntity.Occupation,
                Description = eventVehicleEntity.Description,
                Price = eventVehicleEntity.Price,
                VehicleType = eventVehicleEntity.Vehicle?.Type.ToString(),
                From = eventVehicleEntity.Vehicle?.User?.City?.Name,
                Vehicle = eventVehicleEntity.Vehicle != null ? VehicleDto.Create(eventVehicleEntity.Vehicle) : null,
            };
        }
    }
}