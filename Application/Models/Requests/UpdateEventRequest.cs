using Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace Application.Models.Requests
{
    public class UpdateEventRequest
    {
        [Required]
        public int EventId { get; set; }
        [Required(ErrorMessage = "UserId is required.")]
        public int UserId { get; set; }
        [Required(ErrorMessage = "La ubicación es obligatoria")]
        public int Location { get; set; }
        [Required(ErrorMessage = "Event name is required.")]
        [StringLength(20, MinimumLength = 4, ErrorMessage = "el nombre del evento debe tener entre 4 y 20 caracteres")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Date is required.")]
        public DateTime EventDate { get; set; }
        [Required(ErrorMessage = "Type is required.")]
        public EventType Type { get; set; }
    }
}

