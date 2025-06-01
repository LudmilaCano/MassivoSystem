using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace MassivoProject.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CityController : ControllerBase
    {
        private readonly ICityService _cityService;
        public CityController(ICityService cityService)
        {
            _cityService = cityService;
        }

        [HttpGet("GetCitiesByProvince/{provinceId}")]
        public async Task<IActionResult> GetCitiesByProvince(int provinceId)
        {
            var cities = await _cityService.GetCitiesByProvinceAsync(provinceId);
            if (cities == null || !cities.Any())
            {
                return NotFound("No se encontraron ciudades.");
            }

            return Ok(cities);
        }

        // Endpoint por id
        [HttpGet("GetCoordinatesById/{cityId}")]
        public async Task<IActionResult> GetCoordinatesById(int cityId)
        {
            var city = await _cityService.GetCityByIdAsync(cityId);
            if (city == null)
                return NotFound();

            return Ok(new { city.Latitude, city.Longitude });
        }

        // Endpoint por nombre
        [HttpGet("GetCoordinatesByName/{cityName}")]
        public async Task<IActionResult> GetCoordinatesByName(string cityName)
        {
            var city = await _cityService.GetCityByNameAsync(cityName);
            if (city == null)
                return NotFound();

            return Ok(new { city.Latitude, city.Longitude });
        }
    }
}
