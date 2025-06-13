using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IEventVehicleRepository : IRepositoryBase<EventVehicle>
    {
        Task<EventVehicle> GetByEventIdAndLicensePlateAsync(int eventId, string licensePlate);
        Task<List<EventVehicle>> GetVehiclesByEventAsync(int eventId);
        Task<EventVehicle> GetById(int eventVehicleId);
        Task<IEnumerable<EventVehicle>> GetEventVehiclesByUserIdAsync(int userId);
        Task<EventVehicle> UpdateEventVehicle(EventVehicle eventVehicle);
        Task<bool> BelongsToUserAsync(int eventVehicleId, int userId);

    }
}
