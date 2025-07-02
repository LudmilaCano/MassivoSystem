﻿using Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace Application.Models.Requests
{
    public class CreateEventRequest
    {
        [Required(ErrorMessage = "UserId is required.")]
        public int UserId { get; set; }
        [Required(ErrorMessage = "La ubicación es obligatoria")]
        public int LocationId { get; set; }
        [Required(ErrorMessage = "Event name is required.")]
        [StringLength(50, MinimumLength = 4, ErrorMessage = "el nombre del evento debe tener entre 4 y 20 caracteres")]
        public string Name { get; set; }
        [Required(ErrorMessage = "event description is required.")]
        [StringLength(200, MinimumLength = 4, ErrorMessage = "la descripcion del evento debe tener entre 4 y 200 caracteres")]
        public string Description { get; set; }
        [Required(ErrorMessage = "La Fecha es inválida o está incompleta...")]
        public DateTime EventDate { get; set; }
        [Required(ErrorMessage = "Type is required.")]
        public EventType Type { get; set; }

        [Required(ErrorMessage = "Image URL is required.")]
        public string Image { get; set; }
    }
}