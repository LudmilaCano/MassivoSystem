using Domain.Enums;

namespace Domain.Entities
{
    public class Event
    {
        public int EventId { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        //public string Location { get; set; }
        public int? LocationId { get; set; } 
        public City Location { get; set; }  

        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime EventDate { get; set; }
        public EventType Type { get; set; }
        public string Image { get; set; }
        public ICollection<EventVehicle> EventVehicles { get; set; }
        public EntityState IsActive { get; set; } = EntityState.Active;

        public Event()
        {
            EventVehicles = new List<EventVehicle>();
        }

        public Event(int location, string name, string description, DateTime eventDate, EventType eventType, string image = null)
        {
            LocationId = location;
            Name = name;
            Description = description;
            EventDate = eventDate;
            Type = eventType;
            Image = image;
            EventVehicles = new List<EventVehicle>();
        }
    }
}