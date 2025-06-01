using Application.Interfaces;
using Application.Models.Requests;
using Application.Models.Responses;
using Domain.Entities;
using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
                Occupation = 0
            };

            // Guardar en base de datos
            await _eventVehicleRepository.AddAsync(eventVehicle);

            // Mapear a DTO de respuesta
            var dto = new EventVehicleDto
            {                
                EventId = eventVehicle.EventId,
                LicensePlate = eventVehicle.LicensePlate,
                Date = eventVehicle.Date,
                Occupation = eventVehicle.Occupation                
            };

            return dto;
        }

        public async Task<IEnumerable<EventVehicleDto>> GetAllAsync()
        {
            var entities = await _eventVehicleRepository.ListAsync();
            // Mapear entidades a DTOs (puedes usar AutoMapper si lo tienes configurado)
            return entities.Select(ev => new EventVehicleDto
            {
                EventVehicleId = ev.EventVehicleId,
                EventId = ev.EventId,
                LicensePlate = ev.LicensePlate,
                Date = ev.Date,
                Occupation = ev.Occupation
            });
        }

        public async Task<List<EventVehicleDto>> GetVehiclesByEventAsync(int eventId)
        {
            var eventVehicles = await _eventVehicleRepository.GetVehiclesByEventAsync(eventId);

            return eventVehicles.Select(ev => new EventVehicleDto
            {
                EventVehicleId = ev.EventVehicleId,
                EventId = ev.EventId,
                LicensePlate = ev.LicensePlate,
                Date = ev.Date,
                Occupation = ev.Occupation,
                VehicleType = ev.Vehicle?.Type.ToString(),
                From = ev.Vehicle?.User?.City?.Name ?? string.Empty  // Ajusta según tu modelo
            }).ToList();
        }


        public async Task<EventVehicleDto> GetEventVehicleByIdAsync(int eventVehicleId)
        {
            var entity = await _eventVehicleRepository.GetById(eventVehicleId);

            return new EventVehicleDto
            {
                EventVehicleId = entity.EventVehicleId,
                EventId = entity.EventId,
                LicensePlate = entity.LicensePlate,
                Date = entity.Date,
                Occupation = entity.Occupation,
                VehicleType = entity.Vehicle?.Type.ToString(),
                From = entity.Vehicle?.User?.City?.Name ?? string.Empty // <-- Aquí debe mapear la ciudad
            };
        }
    }
}
