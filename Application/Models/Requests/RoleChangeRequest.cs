using System.ComponentModel.DataAnnotations;

namespace Application.Models.Requests
{
    public class RoleChangeRequest
    {
        [Required]
        public int UserId { get; set; }
        [Required]
        public string NewRole { get; set; } = "Prestador";
    }

}
