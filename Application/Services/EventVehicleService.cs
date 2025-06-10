using Application.Interfaces;
using Application.Models.Requests;
using Application.Models.Responses;
using Domain.Entities;
using Domain.Interfaces;

namespace Application.Services
{
    public class EventVehicleService : IEventVehicleService
    {
        private readonly IEventVehicleRepository _eventVehicleRepository;
        private readonly IVehicleRepository _vehicleRepository;
        private readonly IEventRepository _eventRepository;

        public EventVehicleService(IEventVehicleRepository repository, IVehicleRepository vehicleRepository, IEventRepository eventRepository)
        {
            _eventVehicleRepository = repository;
            _vehicleRepository = vehicleRepository;
            _eventRepository = eventRepository;
        }

        public async Task<EventVehicleDto> AddAsync(AddEventVehicleRequest request)
        {
            // Validar existencia del evento
            var eventEntity = await _eventRepository.GetByIdAsync(request.EventId);
            if (eventEntity == null)
                throw new KeyNotFoundException($"Event with ID {request.EventId} not found.");

            // Validar existencia del vehículo
            var vehicle = await _vehicleRepository.GetByLicensePlateAsync(request.LicensePlate);
            if (vehicle == null)
                throw new KeyNotFoundException($"Vehicle with license plate {request.LicensePlate} not found.");

            // Validar que no exista ya la relación
            var existing = await _eventVehicleRepository.GetByEventIdAndLicensePlateAsync(request.EventId, request.LicensePlate);
            if (existing != null)
                throw new InvalidOperationException("Vehicle is already assigned to this event.");

            // Crear la entidad
            var eventVehicle = new EventVehicle
            {
                EventId = request.EventId,
                LicensePlate = request.LicensePlate,
                Date = request.Date,
                Occupation = 0,
                Price = request.Price
            };

            // Guardar en base de datos
            await _eventVehicleRepository.AddAsync(eventVehicle);

            // Mapear a DTO de respuesta
            var dto = new EventVehicleDto
            {                
                EventId = eventVehicle.EventId,
                LicensePlate = eventVehicle.LicensePlate,
                Date = eventVehicle.Date,
                Occupation = eventVehicle.Occupation,
                Price = eventVehicle.Price
            };

            return dto;
        }

        public async Task<IEnumerable<EventVehicleDto>> GetAllAsync()
        {
            var entities = await _eventVehicleRepository.ListAsync();
            var result = new List<EventVehicleDto>();
            
            foreach (var ev in entities)
            {
                result.Add(new EventVehicleDto
                {
                    EventVehicleId = ev.EventVehicleId,
                    EventId = ev.EventId,
                    LicensePlate = ev.LicensePlate,
                    Date = ev.Date,
                    Occupation = ev.Occupation,
                    Price = ev.Price
                });
            }
            
            return result;
        }

        public async Task<List<EventVehicleDto>> GetVehiclesByEventAsync(int eventId)
        {
            var eventVehicles = await _eventVehicleRepository.GetVehiclesByEventAsync(eventId);
            var result = new List<EventVehicleDto>();
            
            foreach (var ev in eventVehicles)
            {
                var dto = EventVehicleDto.Create(ev);
                result.Add(dto);
            }
            
            return result;
        }

        public async Task<EventVehicleDto> GetEventVehicleByIdAsync(int eventVehicleId)
        {
            var entity = await _eventVehicleRepository.GetById(eventVehicleId);
            if (entity == null)
                throw new KeyNotFoundException($"EventVehicle with ID {eventVehicleId} not found.");
                
            return EventVehicleDto.Create(entity);
        }
    }
}