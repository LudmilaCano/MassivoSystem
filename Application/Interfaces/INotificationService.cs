using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface INotificationService
    {
        Task SendNotificationEmail(string toEmail, NotificationType type, object data, byte[]? qrCodeBytes = null);
    }
}
