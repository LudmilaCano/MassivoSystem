using Application.Interfaces;
using Application.Models.Requests;
using Application.Models.Responses;
using Application.Services;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MassivoProject.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventVehicleController : ControllerBase
    {
        private readonly IEventVehicleService _eventVehicleService;

        public EventVehicleController(IEventVehicleService eventVehicleService)
        {
            _eventVehicleService = eventVehicleService;
        }

        
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<EventVehicle>>> GetEventVehiclesByUserId(int userId)
        {
            var eventVehicles = await _eventVehicleService.GetEventVehiclesByUserIdAsync(userId);
            return Ok(eventVehicles);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EventVehicle>>> Get()
        {
            try
            {
                var list = await _eventVehicleService.GetAllAsync();
                return Ok(list);
            }catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
           
            
        }

        [HttpGet("{eventVehicleId}")]
        public async Task<IActionResult> GetEventVehicleById(int eventVehicleId)
        {
            var eventVehicle = await _eventVehicleService.GetEventVehicleByIdAsync(eventVehicleId);
            if (eventVehicle == null)
                return NotFound();

            return Ok(eventVehicle);
        }


        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AddEventVehicleRequest entity)
        {
            await _eventVehicleService.AddAsync(entity);
            return Ok("Viaje creado");
        }

        [HttpGet("GetVehiclesByEvent/{eventId}")]
        public async Task<IActionResult> GetVehiclesByEvent(int eventId)
        {
            var vehicles = await _eventVehicleService.GetVehiclesByEventAsync(eventId);
            return Ok(vehicles);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<EventVehicleDto>> UpdateEventVehicle(int id, [FromBody] UpdateEventVehicleRequest request)
        {
            if (id != request.EventVehicleId)
            {
                return BadRequest("El ID del viaje no coincide con el ID en la ruta");
            }

            try
            {
                // Obtener el ID del usuario del token
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                {
                    return Unauthorized("Usuario no autenticado");
                }

                int userId = int.Parse(userIdClaim.Value);

                
                 await _eventVehicleService.UpdateEventVehicleAsync(request, userId);

                // Convertir a DTO para la respuesta
                

                return Ok("Evento vehículo modificado!");
            }           
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno: {ex.Message}");
            }
        }

        [HttpPut("toggle-status/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ToggleStatus(int id)
        {
            var result = await _eventVehicleService.ToggleStatusAsync(id);
            if (!result)
                return NotFound($"Viaje con ID {id} no encontrado");

            return Ok(new { message = "Estado del viaje actualizado correctamente" });
        }

        [HttpGet("Activos")]
        public async Task<IActionResult> GetAllEventVehiclesActiveByEvent(int eventId)
        {
            var response = await _eventVehicleService.GetAllEventVehiclesActiveByEventAsync(eventId);
            return Ok(response);
        }

    }


}
