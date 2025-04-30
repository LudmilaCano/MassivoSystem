using System.ComponentModel.DataAnnotations;

namespace Application.Models.Requests
{
    public class UserSignUpRequest
    {
        [Required(ErrorMessage = "El nombre es obligatorio.")]
        [StringLength(30, MinimumLength = 2, ErrorMessage = "El nombre debe tener entre 2 y 30 caracteres.")]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "El apellido es obligatorio.")]
        [StringLength(20, MinimumLength = 2, ErrorMessage = "El apellido debe tener entre 2 y 20 caracteres.")]
        public string LastName { get; set; } = string.Empty;

        [Required(ErrorMessage = "La fecha de nacimiento es obligatoria.")]
        public DateOnly BirthDate { get; set; }

        [RegularExpression(@"^\d{8,9}$", ErrorMessage = "El número de documento debe tener 8 o 9 dígitos.")]
        [Required(ErrorMessage = "El número de documento es obligatorio.")]
        public string DniNumber { get; set; } = string.Empty;

        [RegularExpression(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", ErrorMessage = "El formato del email es inválido.")]
        [EmailAddress(ErrorMessage = "El email no es válido.")]
        [Required(ErrorMessage = "El email es obligatorio.")]
        public string? Email { get; set; }

        [Required(ErrorMessage = "La contraseña es obligatoria.")]
        [StringLength(20, MinimumLength = 6, ErrorMessage = "La contraseña debe tener al menos 6 caracteres.")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "La ciudad es obligatoria.")]
        public string City { get; set; } = string.Empty;

        [Required(ErrorMessage = "La provincia es obligatoria.")]
        public string Province { get; set; } = string.Empty;

    }
}
