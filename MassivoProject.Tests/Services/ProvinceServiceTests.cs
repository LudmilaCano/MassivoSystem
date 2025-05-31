using Application.Services;
using Domain.Entities;
using Domain.Interfaces;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

public class ProvinceServiceTests
{
    private readonly Mock<IProvinceRepository> _repoMock;
    private readonly ProvinceService _service;

    public ProvinceServiceTests() //  mock del repositorio para simular el comportamiento sin acceder a la base de datos
    {
        _repoMock = new Mock<IProvinceRepository>();
        _service = new ProvinceService(_repoMock.Object);// Se inyecta el mock en el servicio que vamos a testear
    }

    [Fact]
    public async Task GetAllProvincesAsync_ReturnsListOfProvinces()
    {
        // Arrange (datos de prueba)
        var expectedProvinces = new List<Province> 
        {
            new Province { Id = 1, Name = "Santa Fe" },
            new Province { Id = 2, Name = "Buenos Aires" }
        };

        _repoMock.Setup(repo => repo.ListAsync())
                 .ReturnsAsync(expectedProvinces);

        // Act (ejecutamos el metodo real del servicio)
        var result = await _service.GetAllProvincesAsync();

        // Assert (verificamos que el resultado sea el esperado)
        Assert.NotNull(result); // verificamos que La respuesta no sea null
        Assert.Equal(2, result.Count); // verificamos que Contenga 2 ciudades
        Assert.Equal("Santa Fe", result[0].Name); // verificamos que La primera se llame "Santa Fe"
    }
}