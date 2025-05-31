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
        void ChangeUserRole(RoleChangeRequest roleChangeRequest);
        void DesactiveUser(int idUser);
        User? GetUserById(int idUser);
        List<User> GetUsers();
        void SignUpUser(UserSignUpRequest userSignUpRequest);
        void UpdateUser(UserUpdateRequest userUpdateRequest, int idUser);
    }
}
