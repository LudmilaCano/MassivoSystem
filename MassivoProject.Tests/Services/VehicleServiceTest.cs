/*using Application.Interfaces;
using Application.Models.Requests;
using Application.Models.Responses;
using Application.Services;
using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Moq;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net.Http.Json;
using System.Net;
using System.Threading.Tasks;
using Xunit;

public class VehicleServiceTests
{
    private readonly Mock<IVehicleRepository> _repoMock;
    private readonly VehicleService _service;

    public VehicleServiceTests()
    {
        _repoMock = new Mock<IVehicleRepository>();
        _service = new VehicleService(_repoMock.Object);
    }


    [Fact]
    public async Task GetAllVehiclesAsync_ReturnsAllVehicles() // PRUEBA 1: Debe retornar todos los vehículos existente
    {
        // Arrange
        var vehicles = new List<Vehicle>
        {
            new Vehicle {
                LicensePlate = "ABC123",
                Name = "Camión 1",
                Type = VehicleType.Combi,
                YearModel = 2020,
                Capacity = 10
            },
            new Vehicle {
                LicensePlate = "DEF456",
                Name = "Camión 2",
                Type = VehicleType.MiniBus,
                YearModel = 2021,
                Capacity = 15
            }
        };

        _repoMock.Setup(repo => repo.ListAsync())
                 .ReturnsAsync(vehicles);

        // Act
        var result = await _service.GetAllVehiclesAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.Count);
        Assert.Equal("ABC123", result[0].LicensePlate);
        Assert.Equal(VehicleType.Combi, result[0].Type);
    }

    [Fact]
    public async Task GetVehiclesByUserIdAsync_ReturnsUserVehicles()// PRUEBA 2: Debe retornar los vehiculos asociados a un usuario
    {
        // Arrange
        int userId = 1;
        var vehicles = new List<Vehicle>
        {
            new Vehicle {
                LicensePlate = "ABC123",
                UserId = userId,
                Type = VehicleType.Auto,
                YearModel = 2019,
                Capacity = 4
            },
            new Vehicle {
                LicensePlate = "DEF456",
                UserId = userId,
                Type = VehicleType.Colectivo,
                YearModel = 2020,
                Capacity = 30
            }
        };

        _repoMock.Setup(repo => repo.GetVehiclesByUserIdAsync(userId))
                 .ReturnsAsync(vehicles);

        // Act
        var result = await _service.GetVehiclesByUserIdAsync(userId);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.Count);
        Assert.All(result, v => Assert.Equal(userId, vehicles.First().UserId));
    }

    [Fact]
    public async Task GetVehicleByLicensePlateAsync_ReturnsVehicle_WhenExists()// PRUEBA 3: Debe retornar un vehículo cuando se busca por una patente existente
    {
        // Arrange
        var licensePlate = "ABC123";
        var vehicle = new Vehicle
        {
            LicensePlate = licensePlate,
            Name = "Test Vehicle",
            Type = VehicleType.MiniBus,
            YearModel = 2022,
            Capacity = 12
        };

        _repoMock.Setup(repo => repo.GetByIdAsync(licensePlate))
                 .ReturnsAsync(vehicle);

        // Act
        var result = await _service.GetVehicleByLicensePlateAsync(licensePlate);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(licensePlate, result.LicensePlate);
        Assert.Equal("Test Vehicle", result.Name);
    }

    [Fact]
    public async Task CreateVehicleAsync_ValidatesRequestBeforeCreation()// PRUEBA 4: Debe validar correctamente los datos antes de crear un vehiculo
    {
        // Arrange
        var validRequest = new VehicleRequest
        {
            LicensePlate = "AB123CD",
            Name = "Valid Vehicle",
            Type = VehicleType.Combi,
            YearModel = DateTime.Now.Year,
            Capacity = 8
        };

        _repoMock.Setup(repo => repo.ExistsByLicensePlateAsync(validRequest.LicensePlate))
                 .ReturnsAsync(false);

        // Act
        var validationResults = new List<ValidationResult>();
        var isValid = Validator.TryValidateObject(validRequest,
            new ValidationContext(validRequest),
            validationResults, true);

        await _service.CreateVehicleAsync(validRequest);

        // Assert
        Assert.True(isValid);
        Assert.Empty(validationResults);
    }

    
    [Fact]
    public async Task CreateVehicleAsync_ThrowsException_WhenLicensePlateExists()// PRUEBA 5: Debe lanzar excepción al intentar crear un vehiculo con patente duplicada
    {
        // Arrange
        var request = new VehicleRequest
        {
            LicensePlate = "EXIST123",
            YearModel = 2020,
            Capacity = 5,
            Type = VehicleType.Auto
        };

        _repoMock.Setup(repo => repo.ExistsByLicensePlateAsync(request.LicensePlate))
                 .ReturnsAsync(true);

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            _service.CreateVehicleAsync(request));
    }

    [Fact]
    public async Task UpdateVehicleAsync_SuccessfullyUpdatesVehicle() // PRUEBA 6: Debe actualizar correctamente los datos de un vehiculo existente
    {
        // Arrange
        var licensePlate = "ABC123";
        var existingVehicle = new Vehicle { LicensePlate = licensePlate };
        var request = new VehicleRequest
        {
            LicensePlate = "ABC123",
            Name = "Updated Name",
            Type = VehicleType.Colectivo,
            YearModel = 2021,
            Capacity = 25
        };

        _repoMock.Setup(repo => repo.GetByIdAsync(licensePlate))
                 .ReturnsAsync(existingVehicle);
        _repoMock.Setup(repo => repo.ExistsByLicensePlateAsync(licensePlate))
                 .ReturnsAsync(false);

        // Act
        await _service.UpdateVehicleAsync(licensePlate, request);

        // Assert
        _repoMock.Verify(repo => repo.UpdateAsync(It.Is<Vehicle>(v =>
            v.LicensePlate == licensePlate &&
            v.Name == "Updated Name" &&
            v.Capacity == 25
        )), Times.Once);
    }

    [Fact]
    public async Task DeactivateVehicleAsync_SuccessfullyDeactivatesVehicle()// PRUEBA 7: Debe desactivar correctamente un vehículo, cambiar estado a inactivo
    {
        // Arrange
        var licensePlate = "ABC123";
        var vehicle = new Vehicle
        {
            LicensePlate = licensePlate,
            IsActive = EntityState.Active
        };

        _repoMock.Setup(repo => repo.GetByIdAsync(licensePlate))
                 .ReturnsAsync(vehicle);

        // Act
        await _service.DeactivateVehicleAsync(licensePlate);

        // Assert
        Assert.Equal(EntityState.Inactive, vehicle.IsActive);
        _repoMock.Verify(repo => repo.UpdateAsync(vehicle), Times.Once);
    }

    [Fact]
    public async Task DeleteVehicleAsync_SuccessfullyDeletesVehicle()// PRUEBA 8: Debe eliminar correctamente un vehiculo del sistema
    {
        // Arrange
        var licensePlate = "ABC123";
        var vehicle = new Vehicle
        {
            LicensePlate = licensePlate,
            Type = VehicleType.MiniBus
        };

        _repoMock.Setup(repo => repo.GetByIdAsync(licensePlate))
                 .ReturnsAsync(vehicle);

        // Act
        await _service.DeleteVehicleAsync(licensePlate);

        // Assert
        _repoMock.Verify(repo => repo.DeleteAsync(vehicle), Times.Once);
    }
} */