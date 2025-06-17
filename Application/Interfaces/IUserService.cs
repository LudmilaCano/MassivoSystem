using Application.Models.Requests;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IUserService
    {
        Task ChangeUserRole(RoleChangeRequest roleChangeRequest);
        Task DesactiveUser(int idUser);
        Task<User?> GetUserById(int idUser);
        Task<List<User>> GetUsers();
        Task SignUpUser(UserSignUpRequest userSignUpRequest);
        Task UpdateUser(UserUpdateRequest userUpdateRequest, int idUser);
    }
}