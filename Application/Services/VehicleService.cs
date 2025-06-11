using Application.Interfaces;
using Application.Models.Requests;
using Application.Models.Responses;
using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Services
{
    public class VehicleService : IVehicleService
    {
        private readonly IVehicleRepository _vehicleRepository;

        public VehicleService(IVehicleRepository vehicleRepository)
        {
            _vehicleRepository = vehicleRepository;
        }

        public async Task<List<VehicleDto>> GetAllVehiclesAsync()
        {
            var vehicles = await _vehicleRepository.ListAsync();
            return vehicles.Select(v => new VehicleDto
            {
                LicensePlate = v.LicensePlate,
                Name = v.Name,
                ImagePath = v.ImagePath,
                Description = v.Description,
                Type = v.Type,
                YearModel = v.YearModel,
                Capacity = v.Capacity,
                Available = v.Available,
                //From = v.From,
                DriverName = v.DriverName,
            }).ToList();
        }

        public async Task<List<VehicleDto>> GetVehiclesByUserIdAsync(int userId)
        {
            var vehicles = await _vehicleRepository.GetVehiclesByUserIdAsync(userId);
            return vehicles.Select(v => new VehicleDto
            {
                LicensePlate = v.LicensePlate,
                Name = v.Name,
                ImagePath = v.ImagePath,
                Description = v.Description,
                Type = v.Type,
                YearModel = v.YearModel,
                Capacity = v.Capacity,
                Available = v.Available,
                //From = v.From,
                DriverName = v.DriverName
            }).ToList();
        }

        public async Task<VehicleDto> GetVehicleByLicensePlateAsync(string licensePlate)
        {
            var vehicle = await _vehicleRepository.GetByIdAsync(licensePlate);
            if (vehicle == null)
                return null;

            return new VehicleDto
            {
                LicensePlate = vehicle.LicensePlate,
                Name = vehicle.Name,
                ImagePath = vehicle.ImagePath,
                Description = vehicle.Description,
                Type = vehicle.Type,
                YearModel = vehicle.YearModel,
                Capacity = vehicle.Capacity,
                Available = vehicle.Available,
                DriverName = vehicle.DriverName
            };
        }

        public async Task CreateVehicleAsync(VehicleRequest request)
        {
            // Verificar si la patente ya existe
            bool exists = await _vehicleRepository.ExistsByLicensePlateAsync(request.LicensePlate);
            if (exists)
            {
                throw new InvalidOperationException("Ya existe un vehículo con esa patente.");
            }

            var vehicle = new Vehicle
            {
                UserId = request.userId,
                LicensePlate = request.LicensePlate.ToUpper(),
                Name = request.Name,
                ImagePath = request.ImagePath,
                Description = request.Description,
                DriverName = request.DriverName,
                Type = request.Type,
                YearModel = request.YearModel,
                Capacity = request.Capacity,
                Available = 0,
                IsActive = EntityState.Active
            };

            await _vehicleRepository.AddAsync(vehicle);
        }

        public async Task UpdateVehicleAsync(string licensePlate, VehicleRequest request)
        {
            var vehicle = await _vehicleRepository.GetByIdAsync(licensePlate);
            if (vehicle == null)
            {
                throw new ArgumentNullException(nameof(vehicle), "Vehículo no encontrado");
            }

            if (licensePlate != request.LicensePlate)
            {
                bool exists = await _vehicleRepository.ExistsByLicensePlateAsync(request.LicensePlate);
                if (exists)
                {
                    throw new InvalidOperationException("Ya existe un vehículo con esa patente.");
                }
            }

            vehicle.LicensePlate = request.LicensePlate.ToUpper();
            vehicle.Name = request.Name ?? vehicle.Name;
            vehicle.ImagePath = request.ImagePath ?? vehicle.ImagePath;
            vehicle.Description = request.Description ?? vehicle.Description;
            vehicle.DriverName = request.DriverName;
            vehicle.Type = request.Type;
            vehicle.YearModel = request.YearModel;
            vehicle.Capacity = request.Capacity;
            vehicle.Available = 0;
            //vehicle.From = request.From ?? vehicle.From;

            await _vehicleRepository.UpdateAsync(vehicle);
        }

        // Application/Services/VehicleService.cs
        // Añade este método a la clase existente
        public async Task<bool> AdminUpdateVehicleAsync(string licensePlate, AdminVehicleUpdateRequest request)
        {
            var vehicle = await _vehicleRepository.GetByLicensePlateAsync(licensePlate);
            if (vehicle == null)
                return false;

            vehicle.Name = request.Name;
            vehicle.Description = request.Description;
            vehicle.Capacity = request.Capacity;
            vehicle.Type = request.Type;
            vehicle.DriverName = request.DriverName;
            vehicle.YearModel = request.YearModel;
            vehicle.ImagePath = request.ImagePath;
            vehicle.Available = request.Available;
            // No actualizamos LicensePlate ya que es la clave primaria

            await _vehicleRepository.UpdateAsync(vehicle);
            return true;
        }

        public async Task DeactivateVehicleAsync(string licensePlate)
        {
            var vehicle = await _vehicleRepository.GetByIdAsync(licensePlate);
            if (vehicle == null)
            {
                throw new ArgumentNullException(nameof(vehicle), "Vehículo no encontrado");
            }

            vehicle.IsActive = EntityState.Inactive;
            await _vehicleRepository.UpdateAsync(vehicle);
        }

        public async Task DeleteVehicleAsync(string licensePlate)
        {
            var vehicle = await _vehicleRepository.GetByIdAsync(licensePlate);
            if (vehicle == null)
            {
                throw new ArgumentNullException(nameof(vehicle), "Vehículo no encontrado");
            }

            await _vehicleRepository.DeleteAsync(vehicle);
        }
    }
}