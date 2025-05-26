using Application.Models.Requests;
using Application.Models.Responses;
using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class BookingService
    {
        private readonly IBookingRepository _bookingRepository;
        private readonly IEventRepository _eventRepository;
        private readonly IVehicleRepository _vehicleRepository;
        public BookingService(IBookingRepository bookingRepository, IEventRepository eventRepository, IVehicleRepository vehicleRepository)
        {
            _bookingRepository = bookingRepository;
            _eventRepository = eventRepository;
            _vehicleRepository = vehicleRepository;
        }

        public async Task<List<BookingDto>> GetBookings()
        {
            var bookings = await _bookingRepository.ListAsync() ?? new List<Booking>();
            var bookingDtos = new List<BookingDto>();
            foreach (var item in bookings)
            {
                var bookingDto = new BookingDto
                {
                    Id = item.Id,
                    Date = item.Date,
                    User = item.User,
                    EventVehicle = item.EventVehicle,
                    Payment = item.Payment,
                    BookingStatus = item.BookingStatus,
                    SeatNumber = item.SeatNumber
                };
                bookingDtos.Add(bookingDto);
            }
            return bookingDtos;
        }

        public async Task<BookingDto?> GetBookingById(int id)
        {
            var booking = await _bookingRepository.GetByIdAsync(id);
            if (booking != null)
            {
                var bookingDto = new BookingDto
                {
                    Id = booking.Id,
                    Date = booking.Date,
                    User = booking.User,
                    EventVehicle = booking.EventVehicle,
                    Payment = booking.Payment,
                    BookingStatus = booking.BookingStatus,
                    SeatNumber = booking.SeatNumber
                };
                return bookingDto;
            }
            return null;
        }

        public async Task<List<BookingDto>> GetBookingByUser(int userId)
        {
            var bookings = await _bookingRepository.GetBookingByUserIdAsync(userId);
            var bookingDtos = new List<BookingDto>();
            if (bookings != null)
            {
                foreach (var booking in bookings)
                {
                    var bookingDto = new BookingDto
                    {
                        Id = booking.Id,
                        Date = booking.Date,
                        User = booking.User,
                        EventVehicle = booking.EventVehicle,
                        Payment = booking.Payment,
                        BookingStatus = booking.BookingStatus,
                        SeatNumber = booking.SeatNumber
                    };
                    bookingDtos.Add(bookingDto);
                }
            }
            return bookingDtos;
        }

        public async Task<BookingDto> AddBooking(AddBookingRequest addBookingRequest)
        {
            var eventEntity = await _eventRepository.GetEventByIdWithVehiclesIncludedAsync(addBookingRequest.EventId)
               ?? throw new KeyNotFoundException($"Evento con ID {addBookingRequest.EventId} no fue encontrado.");
            var eventVehicle = eventEntity.EventVehicles.FirstOrDefault(ev => ev.LicensePlate == addBookingRequest.LicensePlate)
               ?? throw new KeyNotFoundException($"El vehículo con matrícula {addBookingRequest.LicensePlate} no se asignó a este evento.");
            var vehicle = await _vehicleRepository.GetByIdAsync(addBookingRequest.LicensePlate)
               ?? throw new KeyNotFoundException($"Vehículo con matrícula {addBookingRequest.LicensePlate} no fue encontrado.");
            if (addBookingRequest.SeatNumber + vehicle.Available > vehicle.Capacity)
            {
                throw new InvalidOperationException("La suma del número de asientos y la disponibilidad no debe exceder la capacidad del vehículo.");
            }
            if (addBookingRequest.Payment == null)
            {
                throw new ArgumentNullException(nameof(addBookingRequest.Payment), "El pago no puede ser nulo.");
            }
            var booking = new Booking()
            {
                Date = DateTime.Now,
                UserId = addBookingRequest.UserId,
                EventVehicleId = eventVehicle.EventVehicleId,
                BookingStatus = BookingStatus.Confirmed,
                SeatNumber = addBookingRequest.SeatNumber ?? 0,
            };

            var payment = new Payment()
            {
                Amount = addBookingRequest.Payment.Amount,
                Date = DateTime.Now,
                PaymentMethod = addBookingRequest.Payment.PaymentMethod,
                PaymentStatus = PaymentStatus.Success,
                Details = $"Pago de {eventEntity.Name} que va con el vehiculo {vehicle.LicensePlate} - {vehicle.Name}"
            };

            vehicle.Available += booking.SeatNumber;
            await _vehicleRepository.UpdateAsync(vehicle);


            return bookingDto;
        }
    }
}
