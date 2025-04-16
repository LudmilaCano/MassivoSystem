using System.ComponentModel.DataAnnotations;

namespace Application.Models.Requests
{
    public class UserLoginRequest
    {
        [Required(ErrorMessage = "El DNI o Email es obligatorio.")]
        public string DniOrEmail { get; set; } = string.Empty;

        [Required(ErrorMessage = "La contraseña es obligatoria.")]
        public string Password { get; set; } = string.Empty;
    }
}
