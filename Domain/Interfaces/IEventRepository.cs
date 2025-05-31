using Domain.Entities;

namespace Domain.Interfaces
{
    public interface IEventRepository : IRepositoryBase<Event>
    {
        Task<Event> GetEventByIdWithVehiclesIncludedAsync(int id);
        Task<List<Event>> GetAllEventsWithVehiclesIncludedAsync();
        Task<List<Event>> GetRandomEventsAsync(int count);
        Task<List<Event>> FilterEventsAsync(string? name, DateTime? date);

    }
}
