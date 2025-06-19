using Application.Interfaces;
using Application.Models.Requests;
using Application.Models.Responses;
using Domain.Entities;
using Domain.Enums;
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
        private readonly IVehicleRepository _vehicleRepository;
        private readonly IEventRepository _eventRepository;
        private readonly IEventVehicleRepository _eventVehicleRepository;

        private readonly IEmailService _emailService;
        private readonly INotificationService _notificationService;

        public UserService(
        IUserRepository userRepository,
        IVehicleRepository vehicleRepository,
        IEventRepository eventRepository,
        IEventVehicleRepository eventVehicleRepository, 
        IEmailService emailService,
        INotificationService notificationService)
        {
            _userRepository = userRepository;
            _vehicleRepository = vehicleRepository;
            _eventRepository = eventRepository;
            _eventVehicleRepository = eventVehicleRepository;
            _emailService = emailService;
            _notificationService = notificationService;

        }

        public async Task<List<User>> GetUsers()
        {
            return await _userRepository.ListAsync() ?? new List<User>();
        }

        public async Task<User?> GetUserById(int idUser)
        {
            return await _userRepository.GetByIdAsync(idUser);
        }

        public async Task SignUpUser(UserSignUpRequest userSignUpRequest)
        {
            var recoveryCode = GenerateRecoveryCode();
            var user = new User
            {
                FirstName = userSignUpRequest.FirstName,
                LastName = userSignUpRequest.LastName,
                BirthDate = userSignUpRequest.BirthDate,
                IdentificationNumber = userSignUpRequest.DniNumber,
                Email = userSignUpRequest.Email ?? "",
                Password = userSignUpRequest.Password,
                CityId = userSignUpRequest.City,
                ProvinceId = userSignUpRequest.Province,
                IsActive = EntityState.Inactive,
                ProfileImage = userSignUpRequest.ProfileImage,
                RecoveryCode = recoveryCode
            };
            await _userRepository.AddAsync(user);

            await _emailService.SendEmailAsync(
                user.Email,
                "🚀 Activación de cuenta en Massivo App",
                $@"
            <p>¡Hola {user.FirstName}!</p>
            <p>Gracias por registrarte. Para activar tu cuenta, ingresá el siguiente código:</p>
            <p style='font-size: 18px; font-weight: bold;'>{recoveryCode}</p>
            <p>⚠️ Si no te registraste, ignorá este mensaje.</p>
            <br/>
            <p>El equipo de soporte de Massivo App.</p>"
            );
        }

        public async Task<bool> ActivateAccountAsync(string email, string code)
        {
            var user = (await _userRepository.ListAsync())
                .FirstOrDefault(u => u.Email == email && u.RecoveryCode == code);

            if (user == null || user.IsActive == EntityState.Active)
                return false;

            user.IsActive = EntityState.Active;
            user.RecoveryCode = null;

            await _userRepository.UpdateAsync(user);
            return true;
        }
        public async Task UpdateUser(UserUpdateRequest userUpdateRequest, int idUser)
        {
            User? user = await _userRepository.GetByIdAsync(idUser);
            if (user == null)
            {
                throw new ArgumentNullException("User not found");
            }

            user.FirstName = userUpdateRequest.FirstName;
            user.LastName = userUpdateRequest.LastName;
            user.IdentificationNumber = userUpdateRequest.DniNumber;
            user.Email = userUpdateRequest.Email ?? user.Email;
            user.ProfileImage = userUpdateRequest.ProfileImage ?? user.ProfileImage;
            /*if (!string.IsNullOrEmpty(userUpdateRequest.Password))
            {
                user.Password = userUpdateRequest.Password;
            }
            user.CityId = userUpdateRequest.City;
            user.ProvinceId = userUpdateRequest.Province;*/

            await _userRepository.UpdateAsync(user);
        }

        public async Task ChangeUserRole(RoleChangeRequest roleChangeRequest)
        {
            var user = await _userRepository.GetByIdAsync(roleChangeRequest.UserId);
            if (user == null)
            {
                throw new ArgumentNullException("User not found");
            }

            user.Role = roleChangeRequest.NewRole;
            await _userRepository.UpdateAsync(user);

            var userDto = UserNotificationDto.Create(user);
            await _notificationService.SendNotificationEmail(
                user.Email,
                NotificationType.CambioRol,
                userDto
            );
        }

        public async Task DesactiveUser(int idUser)
        {
            User? user = await _userRepository.GetByIdAsync(idUser);
            if (user == null)
            {
                throw new ArgumentNullException("User not found");
            }

            user.IsActive = Domain.Enums.EntityState.Inactive;
            await _userRepository.UpdateAsync(user);
        }

        public async Task<bool> AdminUpdateUserAsync(int userId, AdminUserUpdateRequest request)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                return false;

            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            user.BirthDate = request.BirthDate;
            user.IdentificationNumber = request.IdentificationNumber;
            user.Email = request.Email;
            user.CityId = request.CityId;
            user.ProvinceId = request.ProvinceId;
            user.Role = request.Role;
            user.ProfileImage = request.ProfileImage;
            /*if (!string.IsNullOrEmpty(request.Password))
            {
                user.Password = BCrypt.Net.BCrypt.HashPassword(request.Password);
            }*/

            await _userRepository.UpdateAsync(user);
            return true;
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

        public async Task<bool> ToggleStatusAsync(int userId)
        {
            // Verificar el estado actual del usuario
            var currentState = await _userRepository.GetUserEntityStateAsync(userId);
            bool isDeactivating = currentState == EntityState.Active;

            // Si estamos desactivando, desactivar recursos relacionados
            if (isDeactivating)
            {
                // Desactivar vehículos del usuario
                var licensePlates = await _userRepository.GetUserVehicleLicensePlatesAsync(userId);
                foreach (var licensePlate in licensePlates)
                {
                    // Desactivar EventVehicles asociados al vehículo
                    var eventVehicleIds = await _vehicleRepository.GetVehicleEventVehicleIdsAsync(licensePlate);
                    foreach (var eventVehicleId in eventVehicleIds)
                    {
                        await _eventVehicleRepository.ToggleStatusAsync(eventVehicleId);
                    }

                    // Desactivar el vehículo
                    await _vehicleRepository.ToggleStatusAsync(licensePlate);
                }

                // Desactivar eventos del usuario
                var eventIds = await _userRepository.GetUserEventIdsAsync(userId);
                foreach (var eventId in eventIds)
                {
                    // Desactivar EventVehicles asociados al evento
                    var eventVehicleIds = await _eventRepository.GetEventEventVehicleIdsAsync(eventId);
                    foreach (var eventVehicleId in eventVehicleIds)
                    {
                        await _eventVehicleRepository.ToggleStatusAsync(eventVehicleId);
                    }

                    // Desactivar el evento
                    await _eventRepository.ToggleStatusAsync(eventId);
                }
            }

            // Finalmente, cambiar el estado del usuario
            return await _userRepository.ToggleStatusAsync(userId);
        }

        public async Task<bool> UpdateOwnProfileAsync(int userId, UpdateOwnUserDto request)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                return false;

            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            user.IdentificationNumber = request.IdentificationNumber;
            user.Email = request.Email;

            await _userRepository.UpdateAsync(user);
            return true;
        }

    }
}