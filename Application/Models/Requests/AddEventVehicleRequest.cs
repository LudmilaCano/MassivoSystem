using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Requests
{
    public class AddEventVehicleRequest
    {
        public int EventId { get; set; }
        public string LicensePlate { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public int Occupation { get; set; }
    }
}

