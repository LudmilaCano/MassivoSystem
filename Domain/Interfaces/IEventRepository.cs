using Domain.Entities;
using Domain.Enums;

namespace Domain.Interfaces
{
    public interface IEventRepository : IRepositoryBase<Event>
    {
        Task<Event> GetEventByIdWithVehiclesIncludedAsync(int id);
        Task<List<Event>> GetAllEventsWithVehiclesIncludedAsync();
        Task<List<Event>> GetRandomEventsAsync(int count);
        Task<List<Event>> FilterEventsAsync(string? name, DateTime? date);
        Task<Event> GetById(int id);
        Task<IEnumerable<Event>> GetEventsByUserIdAsync(int userId);
        Task<bool> ToggleStatusAsync(int eventId);
        Task<List<int>> GetEventEventVehicleIdsAsync(int eventId);
        Task<EntityState> GetEventEntityStateAsync(int eventId);

    }
}
