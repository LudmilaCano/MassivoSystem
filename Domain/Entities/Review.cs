using System.ComponentModel.DataAnnotations;

namespace Domain.Entities
{
    public class Review
    {
        [Key]
        public int ReviewId { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public int EventVehicleId { get; set; }
        public EventVehicle EventVehicle { get; set; }
        [Range(1, 5, ErrorMessage = "La calificación debe estar entre 1 y 5.")]
        public int Score { get; set; }
        [StringLength(500, ErrorMessage = "Los comentarios no pueden exceder los 500 caracteres.")]
        public string Comments { get; set; } = string.Empty;
        public DateTime Date { get; set; }
    }
}