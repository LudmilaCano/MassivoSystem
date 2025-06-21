using Application.Models.Responses;
using Domain.Entities;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infraestructure.Data
{
    public class VehicleRepository : RepositoryBase<Vehicle>, IVehicleRepository
    {
        public VehicleRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<bool> ExistsByLicensePlateAsync(string licensePlate)
        {
            return await _dbContext.Set<Vehicle>()
                .AnyAsync(v => v.LicensePlate == licensePlate);
        }

        public async Task<Vehicle> GetByLicensePlateAsync(string licensePlate)
        {
            return await _dbContext.Set<Vehicle>()
                .Where(v => v.LicensePlate == licensePlate)
                .FirstOrDefaultAsync();
        }

        public async Task<List<Vehicle>> GetVehiclesByUserIdAsync(int userId)
        {
            return await _dbContext.Set<Vehicle>()
                .Where(v => v.UserId == userId)
                .ToListAsync();
        }

        public async Task<bool> ToggleStatusAsync(string licensePlate)
        {
            var vehicle = await _dbContext.Vehicles.FindAsync(licensePlate);
            if (vehicle == null)
                return false;

            vehicle.IsActive = vehicle.IsActive == Domain.Enums.EntityState.Active
                    ? Domain.Enums.EntityState.Inactive
                    : Domain.Enums.EntityState.Active;
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<List<int>> GetVehicleEventVehicleIdsAsync(string licensePlate)
        {
            return await _dbContext.EventsVehicles
                .Where(ev => ev.LicensePlate == licensePlate)
                .Select(ev => ev.EventVehicleId)
                .ToListAsync();
        }

        public async Task<Domain.Enums.EntityState> GetVehicleEntityStateAsync(string licensePlate)
        {
            var vehicle = await _dbContext.Vehicles.FindAsync(licensePlate);
            if (vehicle == null)
                return Domain.Enums.EntityState.Inactive;

            return vehicle.IsActive;
        }

        public async Task<List<Vehicle>> GetAllActiveVehiclesAsync()
        {
            return await _dbContext.Set<Vehicle>()
                .Where(v => v.IsActive == Domain.Enums.EntityState.Active)
                .ToListAsync();
        }
    }
}