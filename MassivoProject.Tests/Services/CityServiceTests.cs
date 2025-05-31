using Application.Services;
using Domain.Entities;
using Domain.Interfaces;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

public class CityServiceTests
{
    private readonly Mock<ICityRepository> _repoMock;
    private readonly CityService _service;

    public CityServiceTests()
    {
        _repoMock = new Mock<ICityRepository>();
        _service = new CityService(_repoMock.Object);
    }

    [Fact]
    public async Task GetCitiesByProvinceAsync_ReturnsCitiesList_WhenCitiesExist()
    {
        // Arrange
        int provinceId = 1;
        var expectedCities = new List<City>
        {
            new City { Id = 1, Name = "Rosario", ProvinceId = provinceId },
            new City { Id = 2, Name = "Santa Fe", ProvinceId = provinceId }
        };

        _repoMock.Setup(repo => repo.GetCitiesByProvinceAsync(provinceId))
                 .ReturnsAsync(expectedCities);

        // Act
        var result = await _service.GetCitiesByProvinceAsync(provinceId);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(2, result.Count);
        Assert.Equal("Rosario", result[0].Name);
    }
}