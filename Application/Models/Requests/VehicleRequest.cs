using System.ComponentModel.DataAnnotations;

namespace Application.Models.Requests
{
    public class VehicleRequest
    {
        [Required(ErrorMessage = "La patente es obligatoria.")]
        [RegularExpression(@"^(?:[A-Z]{2}\d{3}[A-Z]{2}|[A-Z]{3}\s?\d{3})$",
            ErrorMessage = "La patente debe tener el formato AA999AA o AAA 999.")]
        public string LicensePlate { get; set; }

        public string Name { get; set; }
        public string ImagePath { get; set; }
        public string Description { get; set; }
        public int Available { get; set; }
        public string From { get; set; }

        public string DriverName { get; set; }

        [Required(ErrorMessage = "El tipo de vehículo es obligatorio.")]
        public string Type { get; set; }

        [Required(ErrorMessage = "El modelo (año) es obligatorio.")]
        [Range(1998, 2100, ErrorMessage = "El modelo debe ser un año válido entre 1998 y el año actual.")]
        public int YearModel { get; set; }

        [Required(ErrorMessage = "La capacidad es obligatoria.")]
        [Range(4, 90, ErrorMessage = "La capacidad debe ser un número mayor a 3 y menor a 90.")]
        public int Capacity { get; set; }
    }
}