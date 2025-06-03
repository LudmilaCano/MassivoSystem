using Domain.Entities;
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
        public string VehicleType { get; set; }
        public string? From { get; set; }

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
                VehicleType = eventVehicleEntity.Vehicle?.Type.ToString(), // <-- Incluye el tipo de vehículo
                From = eventVehicleEntity.Vehicle?.User?.City?.Name ?? string.Empty                // <-- Incluye el lugar de partida
            };
        }
    }
}