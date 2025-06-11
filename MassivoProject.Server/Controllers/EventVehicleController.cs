using Application.Interfaces;
using Application.Models.Requests;
using Application.Services;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;

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



    }
}
