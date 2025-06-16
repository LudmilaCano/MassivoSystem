// Application/Models/Requests/AdminEventUpdateRequest.cs
using Domain.Enums;
using System;
using System.ComponentModel.DataAnnotations;

namespace Application.Models.Requests
{
    public class AdminEventUpdateRequest
    {
        [Required]
        public int EventId { get; set; }

        [Required]
        public string Name { get; set; }

        public string Description { get; set; }

        [Required]
        public DateTime EventDate { get; set; }

        [Required]
        public EventType Type { get; set; }

        public string Image { get; set; }

        public int? LocationId { get; set; }

        public int UserId { get; set; }
    }
}
