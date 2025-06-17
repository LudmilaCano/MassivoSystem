using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface ICityService
    {
        Task<List<City>> GetAllCitiesAsync();
        Task<List<City>> GetCitiesByProvinceAsync(int provinceId);
        Task<City> GetCityByIdAsync(int cityId);
        Task<City> GetCityByNameAsync(string cityName);
    }
}
