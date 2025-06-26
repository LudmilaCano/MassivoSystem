using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using System.Text.Json;

public class MercadoPagoService : IPaymentService
{
    public async Task<string> CrearPreferenciaPagoAsync(string accessToken, string title, decimal amount, string externalReference, string successUrl, string failureUrl)
    {
        var client = new HttpClient();
        client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);

        var preference = new
        {
            items = new[]
            {
                new { title, quantity = 1, currency_id = "ARS", unit_price = amount }
            },
            external_reference = externalReference,
            back_urls = new
            {
                success = successUrl,
                failure = failureUrl
            },
            auto_return = "approved"
        };

        var content = new StringContent(System.Text.Json.JsonSerializer.Serialize(preference), Encoding.UTF8, "application/json");

        var response = await client.PostAsync("https://api.mercadopago.com/checkout/preferences", content);
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception($"Error al crear preferencia: {json}");
        }

        var result = System.Text.Json.JsonSerializer.Deserialize<JsonElement>(json);
        return result.GetProperty("init_point").GetString();
    }
}
