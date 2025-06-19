using System;

namespace Application.Models.Requests
{
    public class UpdateEventVehicleRequest
    {
        public int EventVehicleId { get; set; }
        public int Price { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        
    }
}
