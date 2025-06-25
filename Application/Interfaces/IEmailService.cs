using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string body, byte[] attachment = null, string attachmentName = "QRCode.png");
        Task SendContactEmailAsync(string toEmail, string subject, string body, string customerEmail, string customerName);

    }
}
