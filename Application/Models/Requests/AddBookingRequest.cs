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
        [Required(ErrorMessage = "Debe seleccionarse {0}")]
        [Display(Name = "Evento/Vehiculo")]
        public int EventVehicleId { get; set; }
        public AddPaymentRequest Payment { get; set; }
        [Range(1, int.MaxValue, ErrorMessage = "La {0} debe ser mayor a {1}")]
        [Required(ErrorMessage = "Es necesario ingresar la {0} que desea reservar")]
        [Display(Name = "Cantidad de asientos")]
        public int? SeatNumber { get; set; }
    }
}
