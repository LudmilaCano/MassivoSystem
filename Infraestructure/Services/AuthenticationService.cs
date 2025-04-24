using Application.Interfaces;
using Application.Models.Requests;
using Domain.Entities;
using Domain.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Infraestructure.Services
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;
        public AuthenticationService(IUserRepository userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }

        public string Authenticate(UserLoginRequest userLoginRequest)
        {
            var user = ValidateUser(userLoginRequest);

            if (user == null)
            {
                throw new Exception("User authentication failed");
            }

            var securityPassword = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_configuration["AuthenticacionService:SecretForKey"] ?? ""));
            var credentials = new SigningCredentials(securityPassword, SecurityAlgorithms.HmacSha256);

            //Los claims son datos en clave->valor que nos permite guardar data del usuario.
            var claimsForToken = new List<Claim>();
            claimsForToken.Add(new Claim("sub", user.UserId.ToString())); //"sub" es una key estándar que significa unique user identifier, es decir, si mandamos el id del usuario por convención lo hacemos con la key "sub".
            claimsForToken.Add(new Claim("name", user.FirstName + " " + user.LastName)); 
            claimsForToken.Add(new Claim("role", user.Role.ToString()));

            var jwtSecurityToken = new JwtSecurityToken( 
              _configuration["AutenticacionService:Issuer"],
              _configuration["AutenticacionService:Audience"],
              claimsForToken,
              DateTime.UtcNow,
              DateTime.UtcNow.AddHours(1),
              credentials);

            var tokenToReturn = new JwtSecurityTokenHandler() //Pasamos el token a string
                .WriteToken(jwtSecurityToken);

            return tokenToReturn.ToString();
        }

        private User? ValidateUser(UserLoginRequest userLoginRequest)
        {
            if (string.IsNullOrEmpty(userLoginRequest.DniOrEmail) || string.IsNullOrEmpty(userLoginRequest.Password))
                return null;

            var user = _userRepository.GetUserByEmail(userLoginRequest.DniOrEmail);
            if (user == null) return null;
            if (user.Email == userLoginRequest.DniOrEmail && user.Password == userLoginRequest.Password) return user;
            return null;
        }
    }
}
