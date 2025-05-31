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
    }
}
