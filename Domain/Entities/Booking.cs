using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Booking
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public int EventVehicleId { get; set; }
        public EventVehicle EventVehicle { get; set; }
        public int PaymentId { get; set; }
        public Payment Payment { get; set; }
        public BookingStatus BookingStatus { get; set; }
        public int SeatNumber { get; set; }
    }
}
