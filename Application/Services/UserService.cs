using Application.Interfaces;
using Application.Models.Requests;
using Domain.Entities;
using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IEmailService _emailService;
        public UserService(IUserRepository userRepository, IEmailService emailService)
        {
            _userRepository = userRepository;
            _emailService = emailService;

        }

        public List<User> GetUsers()
        {
            return _userRepository.ListAsync().Result ?? new List<User>();
        }

        public User? GetUserById(int idUser)
        {
            return _userRepository.GetByIdAsync(idUser).Result;
        }

        public void SignUpUser(UserSignUpRequest userSignUpRequest)
        {
            var user = new User
            {
                FirstName = userSignUpRequest.FirstName,
                LastName = userSignUpRequest.LastName,
                BirthDate = userSignUpRequest.BirthDate,
                IdentificationNumber = userSignUpRequest.DniNumber,
                Email = userSignUpRequest.Email ?? "",
                Password = userSignUpRequest.Password,
                CityId = userSignUpRequest.City,
                ProvinceId = userSignUpRequest.Province
            };
            _userRepository.AddAsync(user).Wait();
        }

        public void UpdateUser(UserUpdateRequest userUpdateRequest, int idUser)
        {
            User? user = _userRepository.GetByIdAsync(idUser).Result;
            if (user == null)
            {
                throw new ArgumentNullException("User not found");
            }

            user.FirstName = userUpdateRequest.FirstName;
            user.LastName = userUpdateRequest.LastName;
            user.IdentificationNumber = userUpdateRequest.DniNumber;
            user.Email = userUpdateRequest.Email ?? user.Email;
            if (!string.IsNullOrEmpty(userUpdateRequest.Password))
            {
                user.Password = userUpdateRequest.Password;
            }
            user.CityId = userUpdateRequest.City;
            user.ProvinceId = userUpdateRequest.Province;

            _userRepository.UpdateAsync(user).Wait();
        }

        public void ChangeUserRole(RoleChangeRequest roleChangeRequest)
        {
            User? user = _userRepository.GetByIdAsync(roleChangeRequest.UserId).Result;
            if (user == null)
            {
                throw new ArgumentNullException("User not found");
            }

            user.Role = roleChangeRequest.NewRole;
            _userRepository.UpdateAsync(user).Wait();
        }

        public void DesactiveUser(int idUser)
        {
            User? user = _userRepository.GetByIdAsync(idUser).Result;
            if (user == null)
            {
                throw new ArgumentNullException("User not found");
            }
            user.IsActive = Domain.Enums.EntityState.Inactive;
            _userRepository.UpdateAsync(user).Wait();
        }
        public async Task UpdateUser(User user)
        {
            await _userRepository.UpdateAsync(user);
        }

        public async Task<bool> GenerateRecoveryCodeAndSendEmailAsync(string email)
        {
            var user = (await _userRepository.ListAsync()).FirstOrDefault(u => u.Email == email);
            if (user == null) return false;

            var recoveryCode = GenerateRecoveryCode();
            user.RecoveryCode = recoveryCode;
            user.MustChangePassword = true;

            await _userRepository.UpdateAsync(user);

            await _emailService.SendEmailAsync(
    user.Email,
    "🔒 Recuperación de contraseña – Tu clave provisoria",
    $@"
        <p>Hola,</p>
        <p>Recibimos tu solicitud para restablecer tu contraseña.</p>
        <p><strong>Tu clave provisoria es:</strong> <span style='font-size:18px;'>{recoveryCode} 🔑</span></p>
        <p>⚠️ Si no solicitaste este cambio, ignorá este mensaje.</p>
        <br/>
        <p>Saludos,<br/>El equipo de soporte de Massivo App.</p>"
);


            return true;
        }

        private string GenerateRecoveryCode()
        {
            var random = new Random();
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, 6)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        public async Task<bool> ResetPasswordWithRecoveryCodeAsync(string email, string recoveryCode, string newPassword)
        {
            var user = _userRepository.GetUserByEmail(email);

            if (user == null || user.RecoveryCode != recoveryCode || !user.MustChangePassword)
                return false;

            user.Password = newPassword;
            user.RecoveryCode = null;
            user.MustChangePassword = false;

            await _userRepository.UpdateAsync(user);
            return true;
        }

    }
}
