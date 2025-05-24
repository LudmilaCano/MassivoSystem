using Domain.Enums;

namespace Domain.Entities
{
    public class Event
    {
        public int EventId { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public string Location { get; set; }
        public string Name { get; set; }
        public DateTime EventDate { get; set; }
        public EventType Type { get; set; }
        public ICollection<EventVehicle> EventVehicles { get; set; }

        public Event()
        {
            EventVehicles = new List<EventVehicle>();
        }

        public Event(string location, string name, DateTime eventDate, EventType eventType)
        {
            Location = location;
            Name = name;
            EventDate = eventDate;
            Type = eventType;
            EventVehicles = new List<EventVehicle>();

        }

    }
}
