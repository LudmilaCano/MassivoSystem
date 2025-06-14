using System.ComponentModel.DataAnnotations;

namespace Application.Models.Requests
{
    public class CreateReviewRequest
    {
        [Required(ErrorMessage = "El ID del usuario es requerido.")]
        public int UserId { get; set; }

        [Required(ErrorMessage = "El ID del evento-vehículo es requerido.")]
        public int EventVehicleId { get; set; }

        [Required(ErrorMessage = "La calificación es requerida.")]
        [Range(1, 5, ErrorMessage = "La calificación debe estar entre 1 y 5.")]
        public int Score { get; set; }

        [StringLength(500, ErrorMessage = "Los comentarios no pueden exceder los 500 caracteres.")]
        public string Comments { get; set; } = string.Empty;
    }

    public class UpdateReviewRequest
    {
        [Required(ErrorMessage = "La calificación es requerida.")]
        [Range(1, 5, ErrorMessage = "La calificación debe estar entre 1 y 5.")]
        public int Score { get; set; }

        [StringLength(500, ErrorMessage = "Los comentarios no pueden exceder los 500 caracteres.")]
        public string Comments { get; set; } = string.Empty;
    }
}