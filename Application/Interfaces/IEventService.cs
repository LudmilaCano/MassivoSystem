using Application.Models.Requests;
using Application.Models.Responses;
using Domain.Entities;

namespace Application.Interfaces
{
    public interface IEventService
    {
        Task<List<EventDto>> GetAllEventsAsync();
        Task<EventDto> GetEventByIdAsync(int id);
        Task<EventDto> GetEventById(int id);
        Task<EventDto> AddEventAsync(CreateEventRequest request);
        Task UpdateEventAsync(int Eventid, UpdateEventRequest request, int userId);
        Task DeleteEventAsync(int id);
        Task  AddVehicleToEventAsync(AddEventVehicleRequest request);
        Task DeleteVehicleFromEventAsync(DeleteEventVehicleRequest request);
        Task<List<EventDto>> GetRandomEventsAsync(int count);
        Task<List<EventDto>> FilterEventsAsync(string? name, DateTime? date);

    }
}