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
using QRCoder;
using System.Drawing;
using System.IO;

namespace Application.Services
{
    public class BookingService : IBookingService
    {
        private readonly IBookingRepository _bookingRepository;
        private readonly IEventRepository _eventRepository;
        private readonly IVehicleRepository _vehicleRepository;
        private readonly IPaymentRepository _paymentRepository;

        private readonly IPaymentService _paymentService;
        private readonly IUserRepository _userRepository;
        private readonly INotificationService _notificationService;
        private readonly IEmailService _emailService;
        private readonly IStripeService _stripeService;

        public BookingService(INotificationService notificationService,IUserRepository userRepository, IPaymentService paymentService, IBookingRepository bookingRepository, IEventRepository eventRepository, IVehicleRepository vehicleRepository, IPaymentRepository paymentRepository, IEmailService emailService, IStripeService stripeService)

        {
            _bookingRepository = bookingRepository;
            _eventRepository = eventRepository;
            _vehicleRepository = vehicleRepository;
            _paymentRepository = paymentRepository;
            _paymentService = paymentService;
            _userRepository = userRepository;
            _notificationService = notificationService;
            _emailService = emailService;
            _stripeService = stripeService;
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

            var ownerUser = await _userRepository.GetByIdAsync(vehicle.UserId.Value)
                ?? throw new KeyNotFoundException($"El vehículo {vehicle.LicensePlate} no tiene un usuario asignado.");
            if (eventVehicle.Capacity < addBookingRequest.SeatNumber)
            {
                throw new InvalidOperationException("No hay suficientes asientos disponibles para esta reserva.");
            }

            if (addBookingRequest.Payment == null)
                throw new ArgumentNullException(nameof(addBookingRequest.Payment), "El pago no puede ser nulo.");

            if (addBookingRequest.Payment.PaymentMethod == PaymentMethod.MercadoPago && string.IsNullOrEmpty(ownerUser.MercadoPagoAccessToken))
                throw new InvalidOperationException("El usuario dueño del vehículo no tiene configurado MercadoPago");

            //if (string.IsNullOrEmpty(ownerUser.MercadoPagoAccessToken)) 
                //throw new InvalidOperationException("El usuario dueño del vehículo no tiene configurado MercadoPago");

            Payment payment;

            if ((PaymentMethod)addBookingRequest.Payment.PaymentMethod == PaymentMethod.MercadoPago)
            {
                if (string.IsNullOrEmpty(ownerUser.MercadoPagoAccessToken))
                    throw new InvalidOperationException("El usuario dueño del vehículo no tiene configurado MercadoPago.");

                string paymentUrl = await _paymentService.CrearPreferenciaPagoAsync(
                accessToken: ownerUser.MercadoPagoAccessToken, 
                title: $"Reserva para {eventEntity.Name}",
                amount: (decimal)addBookingRequest.Payment.Amount,
                externalReference: Guid.NewGuid().ToString(),
                successUrl: "https://localhost:5173/booking-list/",
                failureUrl: "https://localhost:5173/booking-list/"
            );

                payment = new Payment
                {
                    Amount = addBookingRequest.Payment.Amount,
                    Date = DateTime.Now,
                    PaymentMethod = addBookingRequest.Payment.PaymentMethod,
                    PaymentStatus = PaymentStatus.Success, // Pending deberia ser pero en testing lo ponemos como aprobado ya que no usamos WebHooks de MP
                    Details = paymentUrl
                };
            }
            else if ((PaymentMethod)addBookingRequest.Payment.PaymentMethod == PaymentMethod.Cash)
            {
                string rapipagoCode = $"RP-{DateTime.Now:yyyyMMdd}-{Random.Shared.Next(1000, 9999)}";

                payment = new Payment
                {
                    Amount = addBookingRequest.Payment.Amount,
                    Date = DateTime.Now,
                    PaymentMethod = addBookingRequest.Payment.PaymentMethod,
                    PaymentStatus = PaymentStatus.Success,
                    Details = $"Código Rapipago: {rapipagoCode} - Monto: ${addBookingRequest.Payment.Amount}"
                };
            }
            else if ((PaymentMethod)addBookingRequest.Payment.PaymentMethod == PaymentMethod.CreditCard ||
            (PaymentMethod)addBookingRequest.Payment.PaymentMethod == PaymentMethod.DebitCard)
            {
                string paymentUrl = await _stripeService.CreatePaymentLinkAsync(
                    amount: (decimal)addBookingRequest.Payment.Amount,
                    eventVehicle.EventVehicleId,
                    description: $"Reserva para {eventEntity.Name} - Vehículo {vehicle.Name}"
                );

                payment = new Payment
                {
                    Amount = addBookingRequest.Payment.Amount,
                    Date = DateTime.Now,
                    PaymentMethod = addBookingRequest.Payment.PaymentMethod,
                    PaymentStatus = PaymentStatus.Success,
                    Details = paymentUrl
                };
            }
            else
            {
                payment = new Payment
                {
                    Amount = addBookingRequest.Payment.Amount,
                    Date = DateTime.Now,
                    PaymentMethod = addBookingRequest.Payment.PaymentMethod,
                    PaymentStatus = PaymentStatus.Success,
                    Details = $"Pago de {eventEntity.Name} para el vehículo {vehicle.LicensePlate} - {vehicle.Name}"
                };
            }

            var paymentSaved = await _paymentRepository.AddAsync(payment);

            var booking = new Booking
            {
                Date = DateTime.Now,
                UserId = addBookingRequest.UserId,
                EventVehicleId = eventVehicle.EventVehicleId,
                BookingStatus = BookingStatus.Confirmed,
                SeatNumber = addBookingRequest.SeatNumber ?? 0,
                PaymentId = paymentSaved.Id
            };

            var bookingSaved = await _bookingRepository.AddAsync(booking);
            //vehicle.Available += booking.SeatNumber;
            eventVehicle.Capacity -= booking.SeatNumber;
            await _vehicleRepository.UpdateAsync(vehicle);

            bookingSaved.Payment = paymentSaved;

            var bookingDto = BookingDto.Create(bookingSaved, eventEntity, vehicle);

            await _notificationService.SendNotificationEmail(
                ownerUser.Email,
                NotificationType.ReservaCreadaPrestador,
                bookingDto
            );

            var user = await _userRepository.GetByIdAsync(addBookingRequest.UserId);
            string qrPayload = $"BookingId:{bookingSaved.Id};UserId:{user.UserId};Event:{eventEntity.Name};Date:{bookingSaved.Date};Estado:{bookingSaved.BookingStatus}";
            byte[] qrCodeBytes = GenerateQrCode(qrPayload);

            if (user != null)
            {
                /*await _notificationService.SendNotificationEmail(
                    user.Email,
                    NotificationType.ReservaCreadaUser,
                    bookingDto,
                    qrCodeBytes
            );
            }*/
                Console.WriteLine($"Método de pago: {addBookingRequest.Payment.PaymentMethod}");

                if ((PaymentMethod)addBookingRequest.Payment.PaymentMethod == PaymentMethod.CreditCard || (PaymentMethod)addBookingRequest.Payment.PaymentMethod == PaymentMethod.DebitCard)
                {
                    _ = Task.Run(async () =>
                    {
                        await Task.Delay(15000);
                        await _emailService.SendEmailAsync( user.Email,
                            "🎟 Confirmación de tu reserva en Massivo App",
                            $@"
                            <p>¡Hola {user.FirstName}!</p>
                            <p>Tu reserva para <strong>{eventEntity.Name}</strong> ha sido confirmada.</p>
                            <p>Adjuntamos tu código QR que usarás para abordar el vehículo.</p>
                            <p>Detalles:</p>
                            <ul>
                                <li>Vehículo: {vehicle.Name} ({vehicle.LicensePlate})</li>
                                <li>Asientos reservados: {booking.SeatNumber}</li>
                                <li>Fecha de reserva: {booking.Date:dd/MM/yyyy HH:mm}</li>
                            </ul>
                            <br/>
                            <p>¡Gracias por usar Massivo App!</p>",
                            qrCodeBytes
                        );
                    });

                    // Retornar sin enviar email
                    return bookingDto;
                }
                await _emailService.SendEmailAsync(
                    user.Email,
                    "🎟 Confirmación de tu reserva en Massivo App",
                    $@"
            <p>¡Hola {user.FirstName}!</p>
            <p>Tu reserva para <strong>{eventEntity.Name}</strong> ha sido confirmada.</p>
            <p>Adjuntamos tu código QR que usarás para abordar el vehículo.</p>
            <p>Detalles:</p>
            <ul>
                <li>Vehículo: {vehicle.Name} ({vehicle.LicensePlate})</li>
                <li>Asientos reservados: {booking.SeatNumber}</li>
                <li>Fecha de reserva: {booking.Date:dd/MM/yyyy HH:mm}</li>
            </ul>
            <br/>
            <p>¡Gracias por usar Massivo App!</p>",
                    qrCodeBytes
                );
            }


            return bookingDto;

        }

        //envio de mails masivos avisos por reservas proximas
        public async Task NotificarReservasProximasAsync()
        {
            var reservasProximas = await _bookingRepository.GetConfirmedBookingsForTomorrowAsync();

            foreach (var reserva in reservasProximas)
            {
                var user = await _userRepository.GetByIdAsync(reserva.UserId);
                var vehicle = reserva.EventVehicle.Vehicle;
                var eventEntity = reserva.EventVehicle.Event;

                if (user != null && !string.IsNullOrEmpty(user.Email))
                {
                    var bookingDto = BookingDto.Create(reserva, eventEntity, vehicle);

                    await _notificationService.SendNotificationEmail(
                        user.Email,
                        NotificationType.ReservaProxima,
                        bookingDto
                    );
                }
            }
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
            var eventVehicle = eventEntity.EventVehicles.FirstOrDefault(ev => ev.LicensePlate == vehicle.LicensePlate)
              ?? throw new KeyNotFoundException($"El vehículo con matrícula {vehicle.LicensePlate} no se asignó a este evento.");

            if (DateTime.Now > eventEntity.EventDate.AddDays(-1))
            {
                throw new InvalidOperationException("No se puede cancelar la reserva dentro de las 24 horas previas al evento.");
            }

            // Se cancela la reserva
            booking.BookingStatus = BookingStatus.Cancelled;
            await _bookingRepository.UpdateAsync(booking);

            // Se libera los espacio del vehiculo
            //vehicle.Available -= booking.SeatNumber;
            eventVehicle.Capacity += booking.SeatNumber;
            await _vehicleRepository.UpdateAsync(vehicle);

            // Se realiza el reembolso del pago
            payment.PaymentStatus = PaymentStatus.Refunded;
            await _paymentRepository.UpdateAsync(payment);

            var bookingDto = BookingDto.Create(booking, eventEntity, vehicle);
            //Se envia notificacion a User
            var user = await _userRepository.GetByIdAsync(booking.UserId);
            await _notificationService.SendNotificationEmail(
                    user.Email,
                    NotificationType.ReservaCancelUser,
                    bookingDto
                    );
            //Se envia notificacion a prestador
            var ownerUser = await _userRepository.GetByIdAsync(vehicle.UserId.Value)
                ?? throw new KeyNotFoundException($"El vehículo {vehicle.LicensePlate} no tiene un usuario asignado.");
            await _notificationService.SendNotificationEmail(
                ownerUser.Email,
                NotificationType.ReservaCancelPrestador,
                bookingDto
            );
        }

        public async Task CompleteBookingAsync(int bookingId)
        {
            var booking = await _bookingRepository.GetBookingWithEventVehicleIdAsync(bookingId)
                ?? throw new KeyNotFoundException($"Reserva con ID {bookingId} no fue encontrada.");

            if (booking.BookingStatus == BookingStatus.Completed)
            {
                throw new InvalidOperationException("La reserva ya fue confirmada anteriormente.");
            }
            if (booking.BookingStatus == BookingStatus.Cancelled)
            {
                throw new InvalidOperationException("La reserva que intenta confirmar fue cancelada.");
            }

            booking.BookingStatus = BookingStatus.Completed;
            await _bookingRepository.UpdateAsync(booking);
        }

        private byte[] GenerateQrCode(string qrText)
        {
            using var qrGenerator = new QRCodeGenerator();
            using var qrData = qrGenerator.CreateQrCode(qrText, QRCodeGenerator.ECCLevel.Q);
            var qrCode = new PngByteQRCode(qrData);
            return qrCode.GetGraphic(20);
        }

    }
}
