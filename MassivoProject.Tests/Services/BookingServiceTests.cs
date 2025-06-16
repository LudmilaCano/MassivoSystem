using Application.Interfaces;
using Application.Models.Requests;
using Application.Models.Responses;
using Application.Services;
using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;
using Moq;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace MassivoProject.Tests.Services
{
    public class BookingServiceTests
    {
        private readonly Mock<IBookingRepository> _bookingRepoMock;
        private readonly Mock<IEventRepository> _eventRepoMock;
        private readonly Mock<IVehicleRepository> _vehicleRepoMock;
        private readonly Mock<IPaymentRepository> _paymentRepoMock;
        private readonly BookingService _service;

        public BookingServiceTests()
        {
            _bookingRepoMock = new Mock<IBookingRepository>();
            _eventRepoMock = new Mock<IEventRepository>();
            _vehicleRepoMock = new Mock<IVehicleRepository>();
            _paymentRepoMock = new Mock<IPaymentRepository>();

            _service = new BookingService(
                _bookingRepoMock.Object,
                _eventRepoMock.Object,
                _vehicleRepoMock.Object,
                _paymentRepoMock.Object);
        }

        // Tests para GetBookingByIdAsync
        /// Verifica que GetBookingByIdAsync lance una excepcion cuando la reserva no existe
        [Fact]
        public async Task GetBookingByIdAsync_ThrowsException_WhenNotFound()
        {
            // Arrange
            _bookingRepoMock.Setup(r => r.GetBookingWithEventVehicleIdAsync(It.IsAny<int>()))
                .ReturnsAsync((Booking)null);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => _service.GetBookingByIdAsync(1));
        }

        // Tests para GetBookingByUserAsync
        /// Verifica que GetBookingByUserAsync lance una excepción cuando el usuario no tiene reservas
        [Fact]
        public async Task GetBookingByUserAsync_ThrowsException_WhenNoBookingsFound()
        {
            // Arrange
            _bookingRepoMock.Setup(r => r.GetBookingByUserIdAsync(It.IsAny<int>()))
                .ReturnsAsync((List<Booking>)null);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => _service.GetBookingByUserAsync(1));
        }

        // Tests para AddBookingAsync
        /// Verifica que AddBookingAsync cree correctamente una reserva cuando la solicitud es valida
        [Fact]
        public async Task AddBookingAsync_CreatesBooking_WhenValidRequest()
        {
            // Arrange
            var request = new AddBookingRequest
            {
                EventId = 1,
                UserId = 1,
                LicensePlate = "ABC123",
                SeatNumber = 2,
                Payment = new AddPaymentRequest { Amount = 100, PaymentMethod = PaymentMethod.CreditCard }
            };

            var eventEntity = new Event
            {
                EventId = 1,
                EventVehicles = new List<EventVehicle>
                {
                    new EventVehicle { EventVehicleId = 1, LicensePlate = "ABC123" }
                }
            };
            var vehicle = new Vehicle { LicensePlate = "ABC123", Capacity = 10, Available = 5 };

            _eventRepoMock.Setup(r => r.GetEventByIdWithVehiclesIncludedAsync(1))
                .ReturnsAsync(eventEntity);
            _vehicleRepoMock.Setup(r => r.GetByIdAsync("ABC123"))
                .ReturnsAsync(vehicle);
            _paymentRepoMock.Setup(r => r.AddAsync(It.IsAny<Payment>()))
                .ReturnsAsync(new Payment { Id = 1 });
            _bookingRepoMock.Setup(r => r.AddAsync(It.IsAny<Booking>()))
                .ReturnsAsync(new Booking { Id = 1 });

            // Act
            var result = await _service.AddBookingAsync(request);

            // Assert
            Assert.NotNull(result);
            _bookingRepoMock.Verify(r => r.AddAsync(It.IsAny<Booking>()), Times.Once);
            _paymentRepoMock.Verify(r => r.AddAsync(It.IsAny<Payment>()), Times.Once);
            _vehicleRepoMock.Verify(r => r.UpdateAsync(It.IsAny<Vehicle>()), Times.Once);
        }

        /// Verifica que AddBookingAsync lance una excepcion cuando el evento no existe
        [Fact]
        public async Task AddBookingAsync_ThrowsException_WhenEventNotFound()
        {
            // Arrange
            var request = new AddBookingRequest
            {
                EventId = 1,
                UserId = 1,
                LicensePlate = "ABC123",
                SeatNumber = 2,
                Payment = new AddPaymentRequest { Amount = 100, PaymentMethod = PaymentMethod.CreditCard }
            };

            _eventRepoMock.Setup(r => r.GetEventByIdWithVehiclesIncludedAsync(1))
                .ReturnsAsync((Event?)null);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => _service.AddBookingAsync(request));
        }

        /// Verifica que AddBookingAsync lance una excepción cuando el vehículo no esta asignado al evento

        [Fact]
        public async Task AddBookingAsync_ThrowsException_WhenVehicleNotAssignedToEvent()
        {
            // Arrange
            var request = new AddBookingRequest
            {
                EventId = 1,
                UserId = 1,
                LicensePlate = "ABC123",
                SeatNumber = 2,
                Payment = new AddPaymentRequest { Amount = 100, PaymentMethod = PaymentMethod.CreditCard }
            };

            var eventEntity = new Event
            {
                EventId = 1,
                EventVehicles = new List<EventVehicle>()
            };

            _eventRepoMock.Setup(r => r.GetEventByIdWithVehiclesIncludedAsync(1))
                .ReturnsAsync(eventEntity);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => _service.AddBookingAsync(request));
        }

        /// Verifica que AddBookingAsync lance una excepción cuando los asientos solicitados exceden la capacidad disponible
        [Fact]
        public async Task AddBookingAsync_ThrowsException_WhenSeatsExceedCapacity()
        {
            // Arrange
            var request = new AddBookingRequest
            {
                EventId = 1,
                UserId = 1,
                LicensePlate = "ABC123",
                SeatNumber = 6,
                Payment = new AddPaymentRequest { Amount = 100, PaymentMethod = PaymentMethod.CreditCard }
            };

            var eventEntity = new Event
            {
                EventId = 1,
                EventVehicles = new List<EventVehicle>
                {
                    new EventVehicle { EventVehicleId = 1, LicensePlate = "ABC123" }
                }
            };
            var vehicle = new Vehicle { LicensePlate = "ABC123", Capacity = 10, Available = 5 };

            _eventRepoMock.Setup(r => r.GetEventByIdWithVehiclesIncludedAsync(1))
                .ReturnsAsync(eventEntity);
            _vehicleRepoMock.Setup(r => r.GetByIdAsync("ABC123"))
                .ReturnsAsync(vehicle);

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(() => _service.AddBookingAsync(request));
        }

        /// Verifica que AddBookingAsync lance una excepción cuando el pago es nulo
        [Fact]
        public async Task AddBookingAsync_ThrowsException_WhenPaymentIsNull()
        {
            // Arrange
            var request = new AddBookingRequest
            {
                EventId = 1,
                UserId = 1,
                LicensePlate = "ABC123",
                SeatNumber = 2,
                Payment = null
            };

            var eventEntity = new Event
            {
                EventId = 1,
                EventVehicles = new List<EventVehicle>
                {
                    new EventVehicle { EventVehicleId = 1, LicensePlate = "ABC123" }
                }
            };
            var vehicle = new Vehicle { LicensePlate = "ABC123", Capacity = 10, Available = 5 };

            _eventRepoMock.Setup(r => r.GetEventByIdWithVehiclesIncludedAsync(1))
                .ReturnsAsync(eventEntity);
            _vehicleRepoMock.Setup(r => r.GetByIdAsync("ABC123"))
                .ReturnsAsync(vehicle);

            // Act & Assert
            await Assert.ThrowsAsync<ArgumentNullException>(() => _service.AddBookingAsync(request));
        }

        // Tests para CancelBookingAsync
        /// Verifica que CancelBookingAsync cancele correctamente una reserva cuando es valida
        [Fact]
        public async Task CancelBookingAsync_CancelsBooking_WhenValid()
        {
            // Arrange
            var booking = new Booking
            {
                Id = 1,
                BookingStatus = BookingStatus.Confirmed,
                EventVehicle = new EventVehicle
                {
                    EventId = 1,
                    LicensePlate = "ABC123"
                },
                PaymentId = 1,
                SeatNumber = 2
            };
            var eventEntity = new Event { EventId = 1, EventDate = DateTime.Now.AddDays(2) };
            var vehicle = new Vehicle { LicensePlate = "ABC123", Available = 5 };
            var payment = new Payment { Id = 1, PaymentStatus = PaymentStatus.Success };

            _bookingRepoMock.Setup(r => r.GetBookingWithEventVehicleIdAsync(1))
                .ReturnsAsync(booking);
            _eventRepoMock.Setup(r => r.GetByIdAsync(1))
                .ReturnsAsync(eventEntity);
            _vehicleRepoMock.Setup(r => r.GetByIdAsync("ABC123"))
                .ReturnsAsync(vehicle);
            _paymentRepoMock.Setup(r => r.GetByIdAsync(1))
                .ReturnsAsync(payment);

            // Act
            await _service.CancelBookingAsync(1);

            // Assert
            Assert.Equal(BookingStatus.Cancelled, booking.BookingStatus);
            Assert.Equal(3, vehicle.Available); // 5 - 2 = 3
            Assert.Equal(PaymentStatus.Refunded, payment.PaymentStatus);
            _bookingRepoMock.Verify(r => r.UpdateAsync(booking), Times.Once);
            _vehicleRepoMock.Verify(r => r.UpdateAsync(vehicle), Times.Once);
            _paymentRepoMock.Verify(r => r.UpdateAsync(payment), Times.Once);
        }

        /// Verifica que CancelBookingAsync lance una excepción cuando la reserva no existe
        [Fact]
        public async Task CancelBookingAsync_ThrowsException_WhenBookingNotFound()
        {
            // Arrange
            _bookingRepoMock.Setup(r => r.GetBookingWithEventVehicleIdAsync(1))
                .ReturnsAsync((Booking)null);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => _service.CancelBookingAsync(1));
        }

    }
}