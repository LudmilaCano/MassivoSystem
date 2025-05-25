using Domain.Entities;
using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Responses
{
    public class BookingDto
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public User User { get; set; }
        public EventVehicle EventVehicle { get; set; }
        public Payment Payment { get; set; }
        public BookingStatus BookingStatus { get; set; }
        public int SeatNumber { get; set; }
    }
}
