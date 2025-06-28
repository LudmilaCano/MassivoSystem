using Application.Interfaces;
using Application.Models.Requests;
using Application.Models.Responses;
using Domain.Entities;
using Domain.Interfaces;
using System.Diagnostics;



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
        public async Task<IEnumerable<EventVehicle>> GetEventVehiclesByUserIdAsync(int userId)
        {
            return await _eventVehicleRepository.GetEventVehiclesByUserIdAsync(userId);
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
            Debug.WriteLine($"[DEBUG] Vehicle Capacity: {vehicle.Capacity}");

            // Crear la entidad
            var eventVehicle = new EventVehicle
            {
                EventId = request.EventId,
                LicensePlate = request.LicensePlate,
                Date = request.Date,
                Occupation = 0,
                Capacity = vehicle.Capacity,
                Price = request.Price,
                Description = request.Description
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
                Capacity = eventVehicle.Capacity,
                Price = eventVehicle.Price,
                Description = eventVehicle.Description
            };

            return dto;
        }
        public async Task<EventVehicle> GetByIdAsync(int id)
        {
            return await _eventVehicleRepository.GetByIdAsync(id);
        }

        public async Task<EventVehicle> UpdateEventVehicleAsync(UpdateEventVehicleRequest request, int userId)
        {
            // Verificar que el EventVehicle pertenece al usuario
            bool belongsToUser = await _eventVehicleRepository.BelongsToUserAsync(request.EventVehicleId, userId);
            if (!belongsToUser)
            {
                throw new UnauthorizedAccessException("No tienes permiso para editar este viaje");
            }

            // Obtener el EventVehicle actual
            var eventVehicle = await _eventVehicleRepository.GetByIdAsync(request.EventVehicleId);
            if (eventVehicle == null)
            {
                throw new KeyNotFoundException($"No se encontró el viaje con ID {request.EventVehicleId}");
            }

            // Actualizar solo los campos permitidos
            eventVehicle.Price = request.Price;
            eventVehicle.Date = request.Date;
            eventVehicle.Description = request.Description;
            

            // Guardar los cambios
            return await _eventVehicleRepository.UpdateEventVehicle(eventVehicle);
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
                    Capacity = ev.Capacity,
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

        public async Task<bool> ToggleStatusAsync(int eventVehicleId)
        {
            return await _eventVehicleRepository.ToggleStatusAsync(eventVehicleId);
        }

        public async Task<List<EventVehicleDto>> GetAllEventVehiclesActiveByEventAsync(int eventId) 
        {
            var response = await _eventVehicleRepository.GetAllActiveVehiclesByEventAsync(eventId);
            if (response == null || response.Count == 0)
                throw new KeyNotFoundException("No se encontró la lista de eventos...");

            return response.Select(EventVehicleDto.Create).ToList();
        }

    }
}