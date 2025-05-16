using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface ICityRepository : IRepositoryBase<City>
    {
        Task<List<City>> GetCitiesByProvinceAsync(int provinceId);
    }
}
