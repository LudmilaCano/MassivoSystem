﻿using Application.Interfaces;
using Application.Models.Requests;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Security.Claims;

namespace MassivoProject.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class EventController : ControllerBase
    {

        private readonly IEventService _eventService;

        public EventController(IEventService eventService)
        {
            _eventService = eventService;
        }


        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Event>>> GetEventsByUserId(int userId)
        {
            var events = await _eventService.GetEventsByUserIdAsync(userId);
            return Ok(events);
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllEvents()
        {
            var events = await _eventService.GetAllEventsAsync();
            return Ok(events);
        }

        [HttpGet("random-events")]
        [AllowAnonymous]
        public async Task<IActionResult> GetLastEvents()
        {
            var events = await _eventService.GetRandomEventsAsync(4);
            return Ok(events);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]

        public async Task<IActionResult> GetEventById(int id)
        {
            var eventById = await _eventService.GetEventById(id);
            return Ok(eventById);
        }

        [HttpPost]
        public async Task<IActionResult> CreateEvent([FromBody] CreateEventRequest request)
        {
            try
            {
                var createdEvent = await _eventService.AddEventAsync(request);
                return Ok(createdEvent);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpPut("{eventId}")]
        public async Task<IActionResult> UpdateEvent(int eventId, [FromBody] UpdateEventRequest request)
        {
            var userId = int.Parse(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value ?? "");

            await _eventService.UpdateEventAsync(eventId, request, userId);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            await _eventService.DeleteEventAsync(id);
            return NoContent();
        }

        [Authorize(Roles = "Admin,Prestador")]
        [HttpPut("admin/{id}")]
        public async Task<IActionResult> AdminUpdateEvent(int id, [FromBody] AdminEventUpdateRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var result = await _eventService.AdminUpdateEventAsync(id, request);
                if (!result)
                    return NotFound(new { Message = "Evento no encontrado." });

                return Ok(new { Message = "Evento actualizado correctamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"Error al actualizar el evento: {ex.Message}" });
            }
        }

        [HttpPost("add-vehicle")]
        public async Task<IActionResult> AddVehicleToEvent(AddEventVehicleRequest request)
        {
            await _eventService.AddVehicleToEventAsync(request);
            return NoContent();

        }

        [HttpDelete("remove-vehicle/{eventId}/{licensePlate}")]
        public async Task<IActionResult> DeleteVehicleFromEvent(int eventId, string licensePlate)
        {
            var request = new DeleteEventVehicleRequest { EventId = eventId, LicensePlate = licensePlate };
            await _eventService.DeleteVehicleFromEventAsync(request);
            return NoContent();
        }

        [HttpGet("filter")]
        [AllowAnonymous]
        public async Task<IActionResult> FilterEvents([FromQuery] string? name, [FromQuery] DateTime? date)
        {
            var events = await _eventService.FilterEventsAsync(name, date);
            return Ok(events);
        }

        [HttpPut("toggle-status/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ToggleStatus(int id)
        {
            var result = await _eventService.ToggleStatusAsync(id);
            if (!result)
                return NotFound($"Evento con ID {id} no encontrado");

            return Ok(new { message = "Estado del evento actualizado correctamente" });
        }


        [HttpGet("Activos")]
        [AllowAnonymous]

        public async Task<IActionResult> GetActiveEvents()
        {
            var events = await _eventService.GetAllActiveEventsWithVehiclesIncludedAsync();
            return Ok(events);
        }

    }
}