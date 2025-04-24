using Application.Models.Requests;
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
        void SignUpUser(UserSignUpRequest userSignUpRequest);
        void UpdateUser(UserUpdateRequest userUpdateRequest, int idUser);
    }
}
