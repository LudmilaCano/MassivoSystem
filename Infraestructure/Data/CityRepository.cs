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
    public class CityRepository : RepositoryBase<City>, ICityRepository
    {
        private readonly ApplicationDbContext _context;

        public CityRepository(ApplicationDbContext context): base(context)
        {
            _context = context;
        }

        public async Task<List<City>> GetCitiesByProvinceAsync(int provinceId)
        {
            return await _dbContext.Set<City>().Where(c => c.ProvinceId == provinceId).ToListAsync();
        }
    }
}
