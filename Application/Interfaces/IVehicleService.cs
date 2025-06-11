using Application.Models.Requests;
using Application.Models.Responses;
using Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IVehicleService
    {
        Task<List<VehicleDto>> GetAllVehiclesAsync();
        Task<VehicleDto> GetVehicleByLicensePlateAsync(string licensePlate);
        Task<List<VehicleDto>> GetVehiclesByUserIdAsync(int userId);
        Task CreateVehicleAsync(VehicleRequest request);
        Task UpdateVehicleAsync(string licensePlate, VehicleRequest request);
        Task<bool> AdminUpdateVehicleAsync(string licensePlate, AdminVehicleUpdateRequest request);

        Task DeactivateVehicleAsync(string licensePlate);
        Task DeleteVehicleAsync(string licensePlate);
    }
}