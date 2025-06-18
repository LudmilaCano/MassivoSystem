using System.Net;
using System.Net.Mail;
using Application.Interfaces;
using Microsoft.Extensions.Configuration;

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    //public async Task SendEmailAsync(string toEmail, string subject, string body)
    //{
    //    try
    //    {
    //        var smtpClient = new SmtpClient(_config["Smtp:Host"])
    //        {
    //            Port = int.Parse(_config["Smtp:Port"]),
    //            Credentials = new NetworkCredential(_config["Smtp:User"], _config["Smtp:Password"]),
    //            EnableSsl = true,
    //        };

    //        var mailMessage = new MailMessage
    //        {
    //            From = new MailAddress(_config["Smtp:From"]),
    //            Subject = subject,
    //            Body = body,
    //            IsBodyHtml = true,
    //        };

    //        mailMessage.To.Add(toEmail);

    //        await smtpClient.SendMailAsync(mailMessage);
    //    }
    //    catch (Exception ex)
    //    {
    //        throw new Exception($"Error inesperado: {ex.Message}");
    //    }
    //}

    public async Task SendEmailAsync(string toEmail, string subject, string body, byte[] attachment = null, string attachmentName = "QRCode.png")
    {
        try
        {
            var smtpClient = new SmtpClient(_config["Smtp:Host"])
            {
                Port = int.Parse(_config["Smtp:Port"]),
                Credentials = new NetworkCredential(_config["Smtp:User"], _config["Smtp:Password"]),
                EnableSsl = true,
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(_config["Smtp:From"]),
                Subject = subject,
                Body = body,
                IsBodyHtml = true,
            };

            mailMessage.To.Add(toEmail);

            if (attachment != null)
            {
                var stream = new MemoryStream(attachment);
                var att = new Attachment(stream, attachmentName, "image/png");
                mailMessage.Attachments.Add(att);
            }

            await smtpClient.SendMailAsync(mailMessage);
        }
        catch (Exception ex)
        {
            throw new Exception($"Error inesperado: {ex.Message}");
        }
    }


}
