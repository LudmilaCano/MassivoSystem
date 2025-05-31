using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Requests
{
    public class DeleteEventVehicleRequest
    {
        [Required(ErrorMessage = "EventId is required.")]
        public int EventId { get; set; }

        [Required(ErrorMessage = "La patente es obligatoria.")]
        [RegularExpression(@"^(?:[A-Z]{2}\d{3}[A-Z]{2}|[A-Z]{3}\s?\d{3})$",
            ErrorMessage = "La patente debe tener el formato AA999AA o AAA 999.")]
        public string LicensePlate { get; set; }
    }
}
