using Application.Interfaces;
using Application.Models.Requests;
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

        public UserService(
        IUserRepository userRepository,
        IVehicleRepository vehicleRepository,
        IEventRepository eventRepository,
        IEventVehicleRepository eventVehicleRepository)
        {
            _userRepository = userRepository;
            _vehicleRepository = vehicleRepository;
            _eventRepository = eventRepository;
            _eventVehicleRepository = eventVehicleRepository;
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

            /*if (!string.IsNullOrEmpty(request.Password))
            {
                user.Password = BCrypt.Net.BCrypt.HashPassword(request.Password);
            }*/

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
    }
}
