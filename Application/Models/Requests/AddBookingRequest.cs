using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Requests
{
    public class AddBookingRequest
    {
        [Required(ErrorMessage = "El identificador del usuario es requerido.")]
        public int UserId { get; set; }
        [Required(ErrorMessage = "Debe asignarse un {0}")]
        [Display(Name = "Evento")]
        public int EventId { get; set; }
        [Required(ErrorMessage = "Debe asignarse una {0}")]
        [Display(Name = "Licencia de Conducir")]
        public string LicensePlate { get; set; }
        public AddPaymentRequest Payment { get; set; }
        [Range(1, int.MaxValue, ErrorMessage = "La {0} debe ser mayor a {1}")]
        [Required(ErrorMessage = "Es necesario ingresar la {0} que desea reservar")]
        [Display(Name = "Cantidad de asientos")]
        public int? SeatNumber { get; set; }
    }
}
