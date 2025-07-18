﻿using Application.Interfaces;
using Application.Models.Requests;
using Application.Models.Responses;
using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;

namespace Application.Services
{
    public class EventService : IEventService
    {
        private readonly IEventRepository _eventRepository;
        private readonly IUserRepository _userRepository;
        private readonly IVehicleRepository _vehicleRepository;
        private readonly IEventVehicleRepository _eventVehicleRepository;

        private readonly INotificationService _notificationService;



        public EventService(IEventRepository eventRepository, IUserRepository userRepository, IVehicleRepository vehicleRepository, INotificationService notificationService, IEventVehicleRepository eventVehicleRepository)
        {
            _eventRepository = eventRepository;
            _userRepository = userRepository;
            _vehicleRepository = vehicleRepository;
            _eventVehicleRepository = eventVehicleRepository;
            _notificationService = notificationService;
        }

        public async Task<IEnumerable<Event>> GetEventsByUserIdAsync(int userId)
        {
            return await _eventRepository.GetEventsByUserIdAsync(userId);
        }

        public async Task<List<EventDto>> GetAllEventsAsync()
        {
            var events = await _eventRepository.GetAllEventsWithVehiclesIncludedAsync();

            if (events == null || !events.Any())

            {
                throw new KeyNotFoundException("No events found.");
            }

            return events.Select(EventDto.Create).ToList();
        }

        public async Task<List<EventDto>> GetRandomEventsAsync(int count)
        {
            var events = await _eventRepository.GetRandomEventsAsync(count);
            return events.Select(EventDto.Create).ToList();
        }

        public async Task<EventDto> GetEventByIdAsync(int id)
        {
            var eventEntity = await _eventRepository.GetByIdAsync(id);

            if (eventEntity == null)
            {
                throw new KeyNotFoundException($"Event with ID {id} not found.");
            }

            return EventDto.Create(eventEntity);
        }


        public async Task<EventDto> AddEventAsync(CreateEventRequest request)
        {
            if (request.EventDate.Date <= DateTime.Today)
            {
                throw new InvalidOperationException("EventDate must be in the future.");
            }
            var newEvent = new Event
            {
                UserId = request.UserId,
                LocationId = request.LocationId,
                Name = request.Name,
                Description = request.Description,
                EventDate = request.EventDate,
                Type = request.Type,
                Image = request.Image
            };

            await _eventRepository.AddAsync(newEvent);

            //var user = await _userRepository.GetByIdAsync(request.UserId);
            //if (user != null && !string.IsNullOrEmpty(user.Email))
            //{
            //    await _notificationService.SendNotificationEmail(
            //        user.Email,
            //        NotificationType.EventoCreado,
            //        EventDto.Create(newEvent)
            //    );
            //}

            return EventDto.Create(newEvent);

        }

        public async Task UpdateEventAsync(int eventId, UpdateEventRequest request, int userId)
        {
            var existingEvent = await _eventRepository.GetEventByIdWithVehiclesIncludedAsync(eventId);

            if (existingEvent == null)
            {
                throw new KeyNotFoundException($"Event with ID {eventId} not found.");
            }

            bool isAdmin = await _userRepository.IsAdmin(userId);

            if (existingEvent.UserId != userId && !isAdmin)
            {
                throw new UnauthorizedAccessException();
            }

            existingEvent.LocationId = request.Location;
            existingEvent.Name = request.Name;
            existingEvent.Description = request.Description;
            existingEvent.EventDate = request.EventDate;
            existingEvent.Type = request.Type;
            existingEvent.Image = request.Image;

            await _eventRepository.UpdateAsync(existingEvent);
        }

        public async Task DeleteEventAsync(int id)
        {
            var eventEntity = await _eventRepository.GetByIdAsync(id);

            if (eventEntity == null)
            {
                throw new KeyNotFoundException($"Event with ID {id} not found.");
            }

            await _eventRepository.DeleteAsync(eventEntity);
        }

        public async Task AddVehicleToEventAsync(AddEventVehicleRequest request)
        {
            var eventEntity = await _eventRepository.GetEventByIdWithVehiclesIncludedAsync(request.EventId);
            if (eventEntity == null)
            {
                throw new KeyNotFoundException($"Event with ID {request.EventId} not found.");
            }

            var vehicle = await _vehicleRepository.GetByLicensePlateAsync(request.LicensePlate);
            if (vehicle == null)
            {
                throw new KeyNotFoundException($"Vehicle with license plate {request.LicensePlate} not found.");
            }

            if (eventEntity.EventVehicles.Any(ev => ev.LicensePlate == request.LicensePlate))
            {
                throw new InvalidOperationException("Vehicle is already assigned to this event.");
            }

            eventEntity.EventVehicles.Add(new EventVehicle
            {
                EventId = request.EventId,
                LicensePlate = request.LicensePlate,
                Date = request.Date,
                Description = request.Description,
                Price = request.Price

            });

            await _eventRepository.UpdateAsync(eventEntity);
        }

        public async Task<bool> AdminUpdateEventAsync(int eventId, AdminEventUpdateRequest request)
        {
            var eventEntity = await _eventRepository.GetByIdAsync(eventId);
            if (eventEntity == null)
                return false;

            eventEntity.Name = request.Name;
            eventEntity.Description = request.Description;
            eventEntity.EventDate = request.EventDate;
            eventEntity.Type = request.Type;
            eventEntity.Image = request.Image;
            eventEntity.LocationId = request.LocationId;
            eventEntity.UserId = request.UserId;

            await _eventRepository.UpdateAsync(eventEntity);
            return true;
        }

        public async Task DeleteVehicleFromEventAsync(DeleteEventVehicleRequest request)
        {
            var eventEntity = await _eventRepository.GetEventByIdWithVehiclesIncludedAsync(request.EventId);
            if (eventEntity == null)
            {
                throw new KeyNotFoundException($"Event with ID {request.EventId} not found.");
            }

            var eventVehicle = eventEntity.EventVehicles.FirstOrDefault(ev => ev.LicensePlate == request.LicensePlate);
            if (eventVehicle == null)
            {
                throw new KeyNotFoundException($"Vehicle with license plate {request.LicensePlate} is not assigned to this event.");
            }

            eventEntity.EventVehicles.Remove(eventVehicle);
            await _eventRepository.UpdateAsync(eventEntity);
        }

        public async Task<List<EventDto>> FilterEventsAsync(string? name, DateTime? date)
        {
            var events = await _eventRepository.FilterEventsAsync(name, date);
            return events.Select(EventDto.Create).ToList();
        }

        public async Task<EventDto> GetEventById(int id)
        {
            var eventEntity = await _eventRepository.GetById(id);

            if (eventEntity == null)
            {
                throw new KeyNotFoundException($"Event with ID {id} not found.");
            }

            return EventDto.Create(eventEntity);
        }

        public async Task<bool> ToggleStatusAsync(int eventId)
        {
            // Verificar el estado actual del evento
            var currentState = await _eventRepository.GetEventEntityStateAsync(eventId);
            bool isDeactivating = currentState == EntityState.Active;

            // Si estamos desactivando, desactivar recursos relacionados
            if (isDeactivating)
            {
                // Desactivar EventVehicles asociados al evento
                var eventVehicleIds = await _eventRepository.GetEventEventVehicleIdsAsync(eventId);
                foreach (var eventVehicleId in eventVehicleIds)
                {
                    await _eventVehicleRepository.ToggleStatusAsync(eventVehicleId);
                }
            }

            // Finalmente, cambiar el estado del evento
            return await _eventRepository.ToggleStatusAsync(eventId);
        }
        public async Task<List<EventDto>> GetAllActiveEventsWithVehiclesIncludedAsync()
        {
            var response = await _eventRepository.GetAllActiveEventsWithVehiclesIncludedAsync();

            if (response == null || response.Count == 0)
                throw new KeyNotFoundException("No se encontró la lista de eventos...");

            return response.Select(EventDto.Create).ToList();
        }
    }
}

