using System.Net.Http.Headers;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MassivoProject.Server.Controllers
{
    [ApiController]
    [Route("api/webhooks/mercadopago")]
    public class MercadoPagoWebhookController : ControllerBase
    {
        private readonly ILogger<MercadoPagoWebhookController> _logger;

        public MercadoPagoWebhookController(ILogger<MercadoPagoWebhookController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> Receive([FromQuery] string id, [FromQuery] string topic)
        {
            _logger.LogInformation($"Webhook recibido: topic={topic}, id={id}");

            if (topic == "payment")
            {
                // Consulta el estado del pago
                var client = new HttpClient();
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "ACCESS_TOKEN_AQUI");

                var response = await client.GetAsync($"https://api.mercadopago.com/v1/payments/{id}");
                var json = await response.Content.ReadAsStringAsync();
                var data = JsonSerializer.Deserialize<JsonElement>(json);

                string status = data.GetProperty("status").GetString();
                string externalReference = data.GetProperty("external_reference").GetString();

                // TODO: actualizar la reserva en tu base de datos según externalReference
                _logger.LogInformation($"Estado del pago: {status}, referencia externa: {externalReference}");

                if (status == "approved")
                {
                    // Actualizar reserva como pagada en tu sistema
                    // await _reservaService.MarcarComoPagada(externalReference);
                }
            }

            return Ok();
        }
    }

}
