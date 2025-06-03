using Domain.Entities;
using Domain.Enums;

namespace Application.Models.Responses
{
    public class EventDto
    {
        public int EventId { get; set; }
        public int UserId { get; set; }
        public string Location { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime EventDate { get; set; }
        public EventType Type { get; set; }
        public string Image { get; set; }
        public ICollection<EventVehicleDto> EventVehicles { get; set; }

        public static EventDto Create(Event eventEntity)
        {
            return new EventDto()
            {
                EventId = eventEntity.EventId,
                UserId = eventEntity.UserId,
                Location = eventEntity.Location?.Name,
                Name = eventEntity.Name,
                Description = eventEntity.Description,
                Type = eventEntity.Type,
                EventDate = eventEntity.EventDate,
                Image = eventEntity.Image,
                EventVehicles = eventEntity.EventVehicles.Select(ev => new EventVehicleDto
                {
                    EventVehicleId = ev.EventVehicleId,
                    EventId = ev.EventId,
                    LicensePlate = ev.LicensePlate,
                    Date = ev.Date,
                    Occupation = ev.Occupation
                }).ToList() ?? new List<EventVehicleDto>(),
            };
        }
    }
}