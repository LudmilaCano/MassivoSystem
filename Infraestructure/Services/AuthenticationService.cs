using Application.Interfaces;
using Application.Models.Requests;
using Application.Models.Responses;
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

        public AuthenticationResult Authenticate(UserLoginRequest userLoginRequest)
        {
            var user = ValidateUser(userLoginRequest);

            if (user == null)
            {
                return new AuthenticationResult
                {
                    Token = string.Empty,
                    RecoveryMode = false,
                    Message = "Credenciales inválidas."
                };
            }

            // Verificamos si el usuario debe cambiar la contraseña (modo recuperación)
            bool recoveryMode = user.MustChangePassword;

            // Generación del token JWT
            var securityPassword = new SymmetricSecurityKey(
                Encoding.ASCII.GetBytes(_configuration["AutenticacionService:SecretForKey"] ?? "")
            );
            var credentials = new SigningCredentials(securityPassword, SecurityAlgorithms.HmacSha256);

            var claimsForToken = new List<Claim>
            {
                new Claim("sub", user.UserId.ToString()),
                new Claim("name", user.FirstName + " " + user.LastName),
                new Claim("role", user.Role.ToString())
            };

            var jwtSecurityToken = new JwtSecurityToken(
                _configuration["AutenticacionService:Issuer"],
                _configuration["AutenticacionService:Audience"],
                claimsForToken,
                DateTime.UtcNow,
                DateTime.UtcNow.AddHours(1),
                credentials
            );

            var tokenToReturn = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);

            return new AuthenticationResult
            {
                Token = tokenToReturn,
                RecoveryMode = recoveryMode,
                Message = recoveryMode
                    ? "Acceso otorgado con clave provisoria. Debe cambiar su contraseña."
                    : "Autenticación exitosa."
            };
        }

        private User? ValidateUser(UserLoginRequest userLoginRequest)
        {
            if (string.IsNullOrEmpty(userLoginRequest.DniOrEmail) || string.IsNullOrEmpty(userLoginRequest.Password))
                return null;

            var user = _userRepository.GetUserByEmail(userLoginRequest.DniOrEmail);
            if (user == null)
                return null;

            // Si el usuario está en modo recuperación, validamos contra la clave provisoria
            if (user.MustChangePassword)
            {
                return user.Password == userLoginRequest.Password ? user : null;
            }

            // Validación normal
            if (user.Email == userLoginRequest.DniOrEmail && user.Password == userLoginRequest.Password)
                return user;

            return null;
        }
    }
}
