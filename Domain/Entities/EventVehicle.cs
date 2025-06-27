﻿using Domain.Enums;

namespace Domain.Entities
{
    public class EventVehicle
    {
        public int EventVehicleId { get; set; }
        public int EventId { get; set; }
        public Event Event { get; set; }
        public string LicensePlate { get; set; }
        public Vehicle Vehicle { get; set; }
        public DateTime Date { get; set; }
        public int Capacity { get; set; }
        public int Occupation { get; set; } = 0;
        public string Description { get; set; }
        public int Price { get; set; }
        public EntityState IsActive { get; set; } = EntityState.Active;
    }
}