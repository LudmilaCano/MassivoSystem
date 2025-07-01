using Domain.Entities;
using Domain.Enums;
using Microsoft.AspNetCore.Mvc.Diagnostics;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace Application.Models.Responses
{
    public class BookingDto
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public EventDto Event { get; set; }
        public VehicleDto Vehicle { get; set; }
        public PaymentDto Payment { get; set; }
        public BookingStatus BookingStatus { get; set; }
        public int SeatNumber { get; set; }
        public static BookingDto Create(Booking bookingEntity, Event eventEntity, Vehicle vehicle)
        {
            return new BookingDto
            {
                Id = bookingEntity.Id,
                Date = bookingEntity.Date,
                BookingStatus = bookingEntity.BookingStatus,
                SeatNumber = bookingEntity.SeatNumber,
                //Event = new()
                //{
                //    EventId = eventEntity.EventId,
                //    Location = eventEntity.Location?.Name,
                //    Name = eventEntity.Name,
                //    Type = eventEntity.Type,
                //    EventDate = eventEntity.EventDate
                //}
                Event = EventDto.Create(eventEntity),
                Vehicle = new()
                {
                    LicensePlate = vehicle.LicensePlate,
                    Name = vehicle.Name,
                    Type = vehicle.Type,
                    ImagePath = vehicle.ImagePath,
                    Description = vehicle.Description,
                    YearModel = vehicle.YearModel,
                    Capacity = vehicle.Capacity,
                    Available = vehicle.Available,
                    DriverName = vehicle.DriverName
                },
                Payment = new()
                {
                    Id = bookingEntity.Payment.Id,
                    Date = bookingEntity.Payment.Date,
                    PaymentMethod = bookingEntity.Payment.PaymentMethod,
                    PaymentStatus = bookingEntity.Payment.PaymentStatus,
                    Amount = bookingEntity.Payment.Amount,
                    Details = bookingEntity.Payment.Details
                }
            };
        }
    }
}
