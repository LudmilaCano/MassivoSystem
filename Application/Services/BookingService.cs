using Application.Interfaces;
using Application.Models.Requests;
using Application.Models.Responses;
using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class BookingService : IBookingService
    {
        private readonly IBookingRepository _bookingRepository;
        private readonly IEventRepository _eventRepository;
        private readonly IVehicleRepository _vehicleRepository;
        private readonly IPaymentRepository _paymentRepository;
        public BookingService(IBookingRepository bookingRepository, IEventRepository eventRepository, IVehicleRepository vehicleRepository, IPaymentRepository paymentRepository)
        {
            _bookingRepository = bookingRepository;
            _eventRepository = eventRepository;
            _vehicleRepository = vehicleRepository;
            _paymentRepository = paymentRepository;
        }

        public async Task<List<BookingDto>> GetBookingsAsync()
        {
            var bookings = await _bookingRepository.GetBookingWithEventVehicleAsync() ?? new List<Booking>();
            var bookingDtos = new List<BookingDto>();
            foreach (var booking in bookings)
            {
                var eventEntity = await _eventRepository.GetEventByIdWithVehiclesIncludedAsync(booking.EventVehicle.EventId)
                    ?? throw new KeyNotFoundException($"Evento con ID {booking.EventVehicle.EventId} no fue encontrado.");
                var vehicle = await _vehicleRepository.GetByIdAsync(booking.EventVehicle.LicensePlate)
                        ?? throw new KeyNotFoundException($"Vehículo con matrícula {booking.EventVehicle.LicensePlate} no fue encontrado.");
                bookingDtos.Add(BookingDto.Create(booking, eventEntity, vehicle));
            }
            return bookingDtos;
        }

        public async Task<BookingDto?> GetBookingByIdAsync(int id)
        {
            var booking = await _bookingRepository.GetBookingWithEventVehicleIdAsync(id)
                    ?? throw new KeyNotFoundException($"Reserva con EventVehicle con ID {id} no fue encontrada.");
            var vehicle = await _vehicleRepository.GetByIdAsync(booking.EventVehicle.LicensePlate)
                ?? throw new KeyNotFoundException($"Vehículo con matrícula {booking.EventVehicle.LicensePlate} no fue encontrado.");
            var eventEntity = await _eventRepository.GetByIdAsync(booking.EventVehicle.EventId)
                ?? throw new KeyNotFoundException($"Evento con ID {booking.EventVehicle.EventId} no fue encontrado.");
            if (booking != null)
            {
                return BookingDto.Create(booking, eventEntity, vehicle);
            }
            return null;
        }

        public async Task<List<BookingDto>> GetBookingByUserAsync(int userId)
        {
            var bookings = await _bookingRepository.GetBookingByUserIdAsync(userId)
                ?? throw new KeyNotFoundException($"Reserva con Usuario con ID {userId} no fue encontrada."); ;
            var bookingDtos = new List<BookingDto>();
            if (bookings != null)
            {
                foreach (var booking in bookings)
                {
                    var eventEntity = await _eventRepository.GetEventByIdWithVehiclesIncludedAsync(booking.EventVehicle.EventId)
                        ?? throw new KeyNotFoundException($"Evento con ID {booking.EventVehicle.EventId} no fue encontrado.");
                    var vehicle = await _vehicleRepository.GetByIdAsync(booking.EventVehicle.LicensePlate)
                            ?? throw new KeyNotFoundException($"Vehículo con matrícula {booking.EventVehicle.LicensePlate} no fue encontrado.");
                    bookingDtos.Add(BookingDto.Create(booking, eventEntity, vehicle));
                }
            }
            return bookingDtos;
        }

        public async Task<BookingDto> AddBookingAsync(AddBookingRequest addBookingRequest)
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
            var paymentSaved = await _paymentRepository.AddAsync(payment);
            booking.PaymentId = paymentSaved.Id;
            var bookingSaved = await _bookingRepository.AddAsync(booking);
            vehicle.Available += booking.SeatNumber;
            await _vehicleRepository.UpdateAsync(vehicle);
            bookingSaved.Payment = paymentSaved;

            return BookingDto.Create(bookingSaved, eventEntity, vehicle);
        }

        public async Task CancelBookingAsync(int bookingId)
        {
            var booking = await _bookingRepository.GetBookingWithEventVehicleIdAsync(bookingId)
                ?? throw new KeyNotFoundException($"Reserva con EventVehicle con ID {bookingId} no fue encontrada.");
            var payment = await _paymentRepository.GetByIdAsync(booking.PaymentId)
                ?? throw new KeyNotFoundException($"Pago con ID {booking.PaymentId} no fue encontrado.");
            var eventEntity = await _eventRepository.GetByIdAsync(booking.EventVehicle.EventId)
               ?? throw new KeyNotFoundException($"Evento con ID {booking.EventVehicle.EventId} no fue encontrado.");
            var vehicle = await _vehicleRepository.GetByIdAsync(booking.EventVehicle.LicensePlate)
                ?? throw new KeyNotFoundException($"Vehículo con matrícula {booking.EventVehicle.LicensePlate} no fue encontrado.");

            if (DateTime.Now > eventEntity.EventDate.AddDays(-1))
            {
                throw new InvalidOperationException("No se puede cancelar la reserva dentro de las 24 horas previas al evento.");
            }

            // Se cancela la reserva
            booking.BookingStatus = BookingStatus.Cancelled;
            await _bookingRepository.UpdateAsync(booking);

            // Se libera los espacio del vehiculo
            vehicle.Available -= booking.SeatNumber;
            await _vehicleRepository.UpdateAsync(vehicle);

            // Se realiza el reembolso del pago
            payment.PaymentStatus = PaymentStatus.Refunded;
            await _paymentRepository.UpdateAsync(payment);
        }
    }
}
