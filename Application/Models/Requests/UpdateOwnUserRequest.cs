using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Requests
{
    public class UpdateOwnUserDto
    {
        //[Required]
        //public int UserId { get; set; }

        [Required(ErrorMessage = "El nombre es obligatorio.")]
        [StringLength(30, MinimumLength = 2, ErrorMessage = "El nombre debe tener entre 2 y 30 caracteres.")]
        public string FirstName { get; set; } = string.Empty;
        [Required(ErrorMessage = "El apellido es obligatorio.")]
        [StringLength(20, MinimumLength = 2, ErrorMessage = "El apellido debe tener entre 2 y 20 caracteres.")]
        public string LastName { get; set; } = string.Empty;
        [RegularExpression(@"^\d{8,9}$", ErrorMessage = "El número de documento debe tener 8 o 9 dígitos.")]
        [Required(ErrorMessage = "El número de documento es obligatorio.")]
        public string IdentificationNumber { get; set; } = string.Empty;

        [RegularExpression(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", ErrorMessage = "El formato del email es inválido.")]
        [EmailAddress(ErrorMessage = "El email no es válido.")]
        [Required(ErrorMessage = "El email es obligatorio.")]
        public string? Email { get; set; }
    }
}
