using Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace Application.Models.Requests
{
    public class VehicleRequest : IValidatableObject
    {
        [Required]
        public int userId { get; set; }
        [Required(ErrorMessage = "La patente es obligatoria.")]
        [RegularExpression(@"^(?:[A-Z]{2}\d{3}[A-Z]{2}|[A-Z]{3}\s?\d{3})$",
            ErrorMessage = "La patente debe tener el formato AA999AA o AAA 999.")]
        public string LicensePlate { get; set; }
        public string Name { get; set; }
        public string ImagePath { get; set; }
        public string Description { get; set; }
        public string DriverName { get; set; }

        [Required(ErrorMessage = "El tipo de vehículo es obligatorio.")]
        public VehicleType Type { get; set; }

        [Required(ErrorMessage = "El modelo (año) es obligatorio.")]
        public int YearModel { get; set; }

        [Required(ErrorMessage = "La capacidad es obligatoria.")]
        [Range(4, 90, ErrorMessage = "La capacidad debe ser un número mayor a 3 y menor a 90.")]
        public int Capacity { get; set; }
        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (YearModel <= 1998 && YearModel > DateTime.Now.Year)
            {
                yield return new ValidationResult(
                    "El modelo debe ser un año válido entre 1998 y el año actual.",
                    new[] { nameof(YearModel) });
            }
        }
    }
}