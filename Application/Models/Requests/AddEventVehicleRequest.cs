using System.ComponentModel.DataAnnotations;

namespace Application.Models.Requests
{
    public class AddEventVehicleRequest
    {
        [Required(ErrorMessage = "EventId is required.")]
        public int EventId { get; set; }

        [Required(ErrorMessage = "La patente es obligatoria.")]
        [RegularExpression(@"^(?:[A-Z]{2}\d{3}[A-Z]{2}|[A-Z]{3}\s?\d{3})$",
            ErrorMessage = "La patente debe tener el formato AA999AA o AAA 999.")]
        public string LicensePlate { get; set; }

        [Required(ErrorMessage = "Date is required.")]
        public DateTime Date { get; set; }

        [Required(ErrorMessage = "Occupation is required.")]
        [Range(1, 90, ErrorMessage = "Occupation allowed range is 1-90.")]
        public int Occupation { get; set; }
    }

}

