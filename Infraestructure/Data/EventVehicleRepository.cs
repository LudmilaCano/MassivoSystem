using Domain.Entities;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infraestructure.Data
{
    public class EventVehicleRepository : RepositoryBase<EventVehicle>, IEventVehicleRepository
    {
        private readonly ApplicationDbContext _context;
        public EventVehicleRepository(ApplicationDbContext context): base(context) 
        {
            _context = context;
        }

        public async Task<EventVehicle> GetByEventIdAndLicensePlateAsync(int eventId, string licensePlate)
        {
            return await _context.EventsVehicles
                .FirstOrDefaultAsync(ev => ev.EventId == eventId && ev.LicensePlate == licensePlate);
        }
    }
}
