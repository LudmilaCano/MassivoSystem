namespace Application.Models.Requests
{
    public class RoleChangeRequest
    {
        public int UserId { get; set; }
        public string NewRole { get; set; } = "Prestador";
    }

}
