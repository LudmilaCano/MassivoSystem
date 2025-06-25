using Application.Interfaces;
using Application.Models.Responses;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MassivoProject.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactController : ControllerBase
    {
        private readonly IEmailService _emailService;

        public ContactController(IEmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendContactEmail([FromBody] ContactFormDto contactForm)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                string toEmail = "massivoapp@gmail.com";

                // SOLO el mensaje que el usuario envía, sin repetir nombre/email
                string body = $"<p>{contactForm.Message}</p>";

                await _emailService.SendContactEmailAsync(toEmail, contactForm.Subject, body, contactForm.Email, contactForm.Name);

                return Ok(new { message = "Mensaje enviado correctamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al enviar el correo: {ex.Message}");
            }
        }
    }
}


