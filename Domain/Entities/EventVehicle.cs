namespace Domain.Entities
{
    public class EventVehicle
    {
        public int EventVehicleId { get; set; }
        public int EventId { get; set; }
        public Event Event { get; set; }
        public string LicensePlate { get; set; }
        public Vehicle Vehicle { get; set; }
        public DateTime Date { get; set; }
        public int Occupation { get; set; } = 0;


    }
}
