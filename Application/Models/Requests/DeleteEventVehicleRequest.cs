using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Requests
{
    public class DeleteEventVehicleRequest
    {
        public int EventId { get; set; }
        public string LicensePlate { get; set; }
    }
}
