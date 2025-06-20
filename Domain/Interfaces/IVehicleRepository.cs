using Domain.Entities;
using Domain.Enums;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IVehicleRepository : IRepositoryBase<Vehicle>
    {
        Task<bool> ExistsByLicensePlateAsync(string licensePlate);
        Task<List<Vehicle>> GetVehiclesByUserIdAsync(int userId);
        Task<Vehicle> GetByLicensePlateAsync(string licensePlate);
        Task<bool> ToggleStatusAsync(string licensePlate);
        Task<List<int>> GetVehicleEventVehicleIdsAsync(string licensePlate);
        Task<EntityState> GetVehicleEntityStateAsync(string licensePlate);
        Task<List<Vehicle>> GetAllActiveVehiclesAsync();


    }
}