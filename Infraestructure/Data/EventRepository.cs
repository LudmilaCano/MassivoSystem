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

        public async Task<Event> GetEventByIdWithVehiclesIncludedAsync(int id)
        {
            return await _context.Events
                .Include(e => e.EventVehicles)
                    .ThenInclude(ev => ev.Vehicle)
                .FirstOrDefaultAsync(e => e.EventId == id);
        }

        public async Task<List<Event>> GetAllEventsWithVehiclesIncludedAsync()
        {
            return await _context.Events
                .Include(e => e.EventVehicles)
                    .ThenInclude(ev => ev.Vehicle)
                .ToListAsync();
        }

    }
    
}
