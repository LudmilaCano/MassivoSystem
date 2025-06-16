using Domain.Entities;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infraestructure.Data
{
    public class EventRepository : RepositoryBase<Event>, IEventRepository
    {

        private readonly ApplicationDbContext _context;

        public EventRepository(ApplicationDbContext context) : base(context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Event>> GetEventsByUserIdAsync(int userId)
        {
            return await _context.Events
                .Where(e => e.UserId == userId)
                .ToListAsync();
        }
        public async Task<Event> GetById(int id)
        {
            return await _context.Events
                .Include(e => e.Location)
                .FirstOrDefaultAsync(e => e.EventId == id);
        }
        public async Task<Event> GetEventByIdWithVehiclesIncludedAsync(int id)
        {
            return await _context.Events
                .Include(e => e.Location)
                .Include(e => e.EventVehicles)
                    .ThenInclude(ev => ev.Vehicle)
                .FirstOrDefaultAsync(e => e.EventId == id);
        }

        public async Task<List<Event>> GetAllEventsWithVehiclesIncludedAsync()
        {
            return await _context.Events
                .Include(e => e.Location)
                .Include(e => e.EventVehicles)
                
                    .ThenInclude(ev => ev.Vehicle)
                .ToListAsync();
        }

        public async Task<List<Event>> GetRandomEventsAsync(int count)
        {
            // Incluye la relación antes de traer los datos a memoria
            var allEvents = await _context.Events
                .Include(e => e.Location)
                .ToListAsync();

            // El ordenamiento aleatorio y el Take se hacen en memoria
            return allEvents
                .OrderBy(e => Guid.NewGuid())
                .Take(count)
                .ToList();
        }

        public async Task<List<Event>> FilterEventsAsync(string? name, DateTime? date)
        {
            var query = _context.Events
                .Include(e => e.Location) 
                .AsQueryable();

            if (!string.IsNullOrEmpty(name))
                query = query.Where(e => e.Name.ToLower().Contains(name.ToLower()));

            if (date.HasValue)
                query = query.Where(e => e.EventDate.Date == date.Value.Date);

            return await query.ToListAsync();
        }

        public async Task<bool> ToggleStatusAsync(int eventId)
        {
            var eventEntity = await _context.Events.FindAsync(eventId);
            if (eventEntity == null)
                return false;

            eventEntity.IsActive = eventEntity.IsActive == Domain.Enums.EntityState.Active
                    ? Domain.Enums.EntityState.Inactive
                    : Domain.Enums.EntityState.Active; 
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<int>> GetEventEventVehicleIdsAsync(int eventId)
        {
            return await _dbContext.EventsVehicles
                .Where(ev => ev.EventId == eventId)
                .Select(ev => ev.EventVehicleId)
                .ToListAsync();
        }

        public async Task<Domain.Enums.EntityState> GetEventEntityStateAsync(int eventId)
        {
            var eventEntity = await _dbContext.Events.FindAsync(eventId);
            return eventEntity?.IsActive ?? Domain.Enums.EntityState.Inactive;
        }

    }

}
