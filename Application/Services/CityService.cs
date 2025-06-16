using Application.Interfaces;
using Domain.Entities;
using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class CityService: ICityService
    {
        private readonly ICityRepository _cityRepository;

        public CityService(ICityRepository cityRepository)
        {
            _cityRepository = cityRepository;
        }
        public async Task<List<City>> GetAllCitiesAsync()
        {
            var cities = await _cityRepository.ListAsync();
            return cities.Select(c => new City
            {
                Id = c.Id,
                Name = c.Name,
                ProvinceId = c.ProvinceId,
                Latitude = c.Latitude,
                Longitude = c.Longitude
            }).ToList();
        }

        public async Task<List<City>> GetCitiesByProvinceAsync(int provinceId)
        {
            return await _cityRepository.GetCitiesByProvinceAsync(provinceId);
        }

        public async Task<City> GetCityByIdAsync(int cityId)
        {
            var city = await _cityRepository.GetByIdAsync(cityId);
            return city;
        }

        public async Task<City> GetCityByNameAsync(string cityName)
        {
            var city = await _cityRepository.GetByNameAsync(cityName);
            return city;
        }
    }
}
