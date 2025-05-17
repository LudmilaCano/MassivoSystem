using Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IVehicleRepository : IRepositoryBase<Vehicle>
    {
        Task<bool> ExistsByLicensePlateAsync(string licensePlate);
        Task<List<Vehicle>> GetVehiclesByUserIdAsync(int userId);
    }
}