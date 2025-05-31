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
            var list = await _eventVehicleService.GetAllAsync();
            return Ok(list);
        }


        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AddEventVehicleRequest entity)
        {
            await _eventVehicleService.AddAsync(entity);
            return Ok("Viaje creado");
        }
    }
}
