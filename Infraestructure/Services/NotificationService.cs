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



                        // Agregar casos según el tipo
                }

                await _emailService.SendEmailAsync(toEmail, subject, body);
            }
        }
    }
}
