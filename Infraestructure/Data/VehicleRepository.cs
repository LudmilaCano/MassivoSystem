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
    }
}