using Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Requests
{
    public class AddPaymentRequest
    {
        [Required(ErrorMessage = "El {0} es requerido")]
        [Display(Name = "Método de Pago")]
        public PaymentMethod PaymentMethod { get; set; }
        [Required(ErrorMessage = "El {0} es requerido")]
        [Range(1, double.MaxValue, ErrorMessage = "El {0} debe ser mayor a {1}")]
        [Display(Name = "Monto")]
        public double Amount { get; set; }
    }
}
