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

        public static EventVehicleDto Create(EventVehicle eventVehicleEntity)
        {
            return new EventVehicleDto
            {
                EventVehicleId = eventVehicleEntity.EventVehicleId,
                EventId = eventVehicleEntity.EventId,
                LicensePlate = eventVehicleEntity.LicensePlate,
                Date = eventVehicleEntity.Date,
                Occupation = eventVehicleEntity.Occupation
            };
        }
    }
}