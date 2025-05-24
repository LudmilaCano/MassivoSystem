using Application.Interfaces;
using Application.Models.Requests;
using Microsoft.AspNetCore.Mvc;
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

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllEvents()
        {
            var events = await _eventService.GetAllEventsAsync();
            return Ok(events);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]

        public async Task<IActionResult> GetEventById(int id)
        {
            var eventById = await _eventService.GetEventByIdAsync(id);
            return Ok(eventById);
        }

        [HttpPost]
        public async Task<IActionResult> CreateEvent([FromBody] CreateEventRequest request)
        {
            var createdEvent = await _eventService.AddEventAsync(request);
            return Ok(createdEvent);
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

        [HttpPost("add-vehicle")]
        public async Task<IActionResult> AddVehicleToEvent(AddEventVehicleRequest request)
            {
            await _eventService.AddVehicleToEventAsync(request);
                return NoContent();
            }
            catch (ArgumentNullException)
            {
                return NotFound(new { Message = "Vehículo no encontrado." });
            }
        }

        [HttpDelete("remove-vehicle")]
        public async Task<IActionResult> DeleteVehicleFromEvent(DeleteEventVehicleRequest request)
            {
            await _eventService.DeleteVehicleFromEventAsync(request);
                return NoContent();
            }
            catch (ArgumentNullException)
            {
                return NotFound(new { Message = "Vehículo no encontrado." });
            }
        }
    }
}
    }
}