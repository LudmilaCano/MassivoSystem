using Domain.Enums;

namespace Application.Models.Requests
{
    public class CreateEventRequest
    {
        //agregar validaciones!
        public int UserId { get; set; }
        public string Location { get; set; }
        public string Name { get; set; }
        public DateTime EventDate { get; set; }
        public EventType Type { get; set; }
    }
}
