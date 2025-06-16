using Domain.Entities;
using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Domain.Interfaces
{
    public interface IUserRepository : IRepositoryBase<User>
    {
        User? GetUserByEmail(string? email);
        Task<bool> ExistsByIdentificationNumberAsync(string identificationNumber);
        Task<bool> ExistsByEmailAsync(string email);
        Task<bool>IsAdmin(int userId);
        Task<bool> ToggleStatusAsync(int userId);
        Task<List<string>> GetUserVehicleLicensePlatesAsync(int userId);
        Task<List<int>> GetUserEventIdsAsync(int userId);
        Task<EntityState> GetUserEntityStateAsync(int userId);


    }
}
