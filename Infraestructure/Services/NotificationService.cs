using Application.Interfaces;
using Application.Models.Responses;
using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infraestructure.Services
{
    namespace Infrastructure.Services
    {
        public class NotificationService : INotificationService
        {
            private readonly IEmailService _emailService;

            public NotificationService(IEmailService emailService)
            {
                _emailService = emailService;
            }

            public async Task SendNotificationEmail(string toEmail, NotificationType type, object data)
            {
                string subject = "";
                string body = "";

                switch (type)
                {
                    case NotificationType.VehiculoCreado:
                        var vehiculo = data as VehicleDto;
                        subject = "🚗 Vehículo creado exitosamente";
                        body = $"<p>Hola,</p>" +
                               $"<p>Tu vehículo <b>{vehiculo.Name}</b> con patente <span style='font-size:18px;'>{vehiculo.LicensePlate} 🚗 </span> fue creado correctamente.</p>" +
                               "<p>¡Gracias por confiar en nosotros!</p>";
                        break;

                    case NotificationType.EventoCreado:
                        var evento = data as EventDto;
                        subject = "🎉 Evento creado correctamente";
                        body = $"<p>Hola,</p>" +
                               $"<p>Tu evento <b>{evento.Name}</b> fue registrado para el <span style='font-size:18px;'>{evento.EventDate.ToShortDateString()} 🎉 </span>.</p>" +
                               "<p>¡Gracias por usar nuestra plataforma!</p>";
                        break;

                    case NotificationType.ReservaCreadaPrestador:
                        var reservaPrestador = data as BookingDto;
                        subject = "📢 Nueva reserva para tu vehículo";
                        body = $@"
                            <p>Hola,</p>
                            <p>Se ha realizado una nueva reserva para tu vehículo <b>{reservaPrestador.Vehicle.Name}</b> con matrícula  <span style='font-size:18px;'>{reservaPrestador.Vehicle.LicensePlate}🚗 </span>.</p>
                            <p>Evento: <span style='font-size:18px;'>{reservaPrestador.Event.Name}🎉 </span></p>
                            <p>Fecha: {reservaPrestador.Event.EventDate} 📆 </p>
                            <p>Asientos reservados: {reservaPrestador.SeatNumber}</p>
                            <b>Monto abonado:</b> {reservaPrestador.Payment.Amount:N2}
                            <p>Por favor, revisá tu panel para más información.</p>";
                        break;

                    case NotificationType.ReservaCreadaUser:
                        var reservaUsuario = data as BookingDto;
                        subject = "✅ Reserva confirmada";
                        body = $@"
                            <p>Hola,</p>
                            <p>Tu reserva fue confirmada correctamente.</p>
                            <p>Evento: <b>{reservaUsuario.Event.Name}</b></p>
                            <p>Fecha de salida: {reservaUsuario.Event.EventDate}</p>
                            <p>Vehículo: <b>{reservaUsuario.Vehicle.Name}</b> ({reservaUsuario.Vehicle.LicensePlate})</p>
                            <p>Asientos reservados: {reservaUsuario.SeatNumber}</p>                            
                            <b>Monto abonado:</b> {reservaUsuario.Payment.Amount:N2}
                            <p>Con este correo podés presentarte el día de la salida programada.</p>";
                        break;



                        // Agregar casos según el tipo
                }

                await _emailService.SendEmailAsync(toEmail, subject, body);
            }
        }
    }
}
