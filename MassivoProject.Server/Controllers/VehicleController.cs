using Application.Interfaces;
using Application.Models.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace MassivoProject.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VehicleController : ControllerBase
    {
        private readonly IVehicleService _vehicleService;

        public VehicleController(IVehicleService vehicleService)
        {
            _vehicleService = vehicleService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllVehicles()
        {
            var vehicles = await _vehicleService.GetAllVehiclesAsync();
            return Ok(vehicles);
        }

        [HttpGet("{licensePlate}")]
        public async Task<IActionResult> GetVehicleByPlate(string licensePlate)
        {
            var vehicle = await _vehicleService.GetVehicleByLicensePlateAsync(licensePlate);
            if (vehicle == null)
            {
                return NotFound(new { Message = "Vehículo no encontrado." });
            }

            return Ok(vehicle);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetVehiclesByUser(int userId)
        {
            var vehicles = await _vehicleService.GetVehiclesByUserIdAsync(userId);
            if (vehicles == null || !vehicles.Any())
            {
                return NotFound(new { Message = "No se encontraron vehículos para este usuario." });
            }

            return Ok(vehicles);
        }

        [HttpPost]
        public async Task<IActionResult> CreateVehicle([FromBody] VehicleRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _vehicleService.CreateVehicleAsync(request);
                return StatusCode(201, new { Message = "Vehículo registrado correctamente." });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { Message = ex.Message });
            }
        }

        [HttpPut("{licensePlate}")]
        public async Task<IActionResult> UpdateVehicle(string licensePlate, [FromBody] VehicleRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _vehicleService.UpdateVehicleAsync(licensePlate, request);
                return NoContent();
            }
            catch (ArgumentNullException)
            {
                return NotFound(new { Message = "Vehículo no encontrado." });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { Message = ex.Message });
            }
        }

        [HttpPut("{licensePlate}/deactivate")]
        public async Task<IActionResult> DeactivateVehicle(string licensePlate)
        {
            try
            {
                await _vehicleService.DeactivateVehicleAsync(licensePlate);
                return NoContent();
            }
            catch (ArgumentNullException)
            {
                return NotFound(new { Message = "Vehículo no encontrado." });
            }
        }

        [HttpDelete("{licensePlate}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteVehicle(string licensePlate)
        {
            try
            {
                await _vehicleService.DeleteVehicleAsync(licensePlate);
                return NoContent();
            }
            catch (ArgumentNullException)
            {
                return NotFound(new { Message = "Vehículo no encontrado." });
            }
        }
    }
}