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

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
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
            await _userRepository.AddAsync(user);
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
            if (!string.IsNullOrEmpty(userUpdateRequest.Password))
            {
                user.Password = userUpdateRequest.Password;
            }
            user.CityId = userUpdateRequest.City;
            user.ProvinceId = userUpdateRequest.Province;

            await _userRepository.UpdateAsync(user);
        }

        public async Task ChangeUserRole(RoleChangeRequest roleChangeRequest)
        {
            User? user = await _userRepository.GetByIdAsync(roleChangeRequest.UserId);
            if (user == null)
            {
                throw new ArgumentNullException("User not found");
            }

            user.Role = roleChangeRequest.NewRole;
            await _userRepository.UpdateAsync(user);
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
    }
}