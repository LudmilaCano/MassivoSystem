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
        Task<bool> AdminUpdateUserAsync(int userId, AdminUserUpdateRequest request);
        Task<bool> ToggleStatusAsync(int userId);
        Task UpdateUser(User user);
        Task<bool> GenerateRecoveryCodeAndSendEmailAsync(string email);
        Task<bool> ResetPasswordWithRecoveryCodeAsync(string email, string recoveryCode, string newPassword);
        Task<bool> ActivateAccountAsync(string email, string code);
    }
}