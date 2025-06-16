using Application.Models.Requests;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text;

namespace MassivoProject.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RouteController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;

        public RouteController(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
        }

        [HttpPost]
        public async Task<IActionResult> GetRoute([FromBody] RouteRequest request)
        {
            var apiKey = _configuration["OpenRouteService:ApiKey"];
            var httpClient = _httpClientFactory.CreateClient();

            var body = new
            {
                coordinates = new[]
                {
                new[] { request.From.Lng, request.From.Lat },
                new[] { request.To.Lng, request.To.Lat }
            }
            };

            var content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");
            var req = new HttpRequestMessage(HttpMethod.Post, "https://api.openrouteservice.org/v2/directions/driving-car/geojson");
            req.Headers.Add("Authorization", apiKey);
            req.Content = content;

            var response = await httpClient.SendAsync(req);
            var json = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, json);
            }

            return Content(json, "application/json");
        }
    }

}
