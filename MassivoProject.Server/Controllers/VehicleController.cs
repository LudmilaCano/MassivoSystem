using Application.Interfaces;
using Application.Models.Requests;
using Application.Models.Responses;
using Domain.Entities;
using Domain.Enums;
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
        private readonly INotificationService _notificationService;

        public VehicleController(IVehicleService vehicleService, INotificationService notificationService)
        {
            _vehicleService = vehicleService;
            _notificationService = notificationService;
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
                var createdVehicle = await _vehicleService.CreateVehicleAsync(request);
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

        [Authorize(Roles = "Admin")]
        [HttpPut("admin/{licensePlate}")]
        public async Task<IActionResult> AdminUpdateVehicle(string licensePlate, [FromBody] AdminVehicleUpdateRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var result = await _vehicleService.AdminUpdateVehicleAsync(licensePlate, request);
                if (!result)
                    return NotFound(new { Message = "Vehículo no encontrado." });

                return Ok(new { Message = "Vehículo actualizado correctamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Error al actualizar el vehículo: {ex.Message}" });
            }
        }

        [HttpPut("toggle-status/{licensePlate}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ToggleStatus(string licensePlate)
        {
            var result = await _vehicleService.ToggleStatusAsync(licensePlate);
            if (!result)
                return NotFound($"Vehículo con patente {licensePlate} no encontrado");

            return Ok(new { message = "Estado del vehículo actualizado correctamente" });
        }

        [HttpGet("Active")]
        public async Task<IActionResult> GetActiveVehicles()
        {
            var vehicles = await _vehicleService.GetAllActiveVehiclesAsync();

            var vehicleDtos = vehicles.Select(VehicleDto.Create).ToList();

            return Ok(vehicleDtos);
        }


    }
}