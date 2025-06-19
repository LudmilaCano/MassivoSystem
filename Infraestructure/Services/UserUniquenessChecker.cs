using Application.Interfaces;
using Domain.Interfaces;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infraestructure.Services
{
    public class UserUniquenessChecker : IUserUniquenessChecker
    {
        private readonly IUserRepository _userRepository;
        private readonly ILogger<UserUniquenessChecker> _logger;

        public UserUniquenessChecker(IUserRepository userRepository, ILogger<UserUniquenessChecker> logger)
        {
            _userRepository = userRepository;
            _logger = logger;
        }

        public async Task<bool> IsIdentificationNumberUnique(string identificationNumber)
        {
            try
            {
                return !await _userRepository.ExistsByIdentificationNumberAsync(identificationNumber);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validando unicidad de IdentificationNumber: {IdentificationNumber}", identificationNumber);
                return false;
            }
        }

        public async Task<bool> IsEmailUnique(string email)
        {
            try
            {
                return !await _userRepository.ExistsByEmailAsync(email);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validando unicidad de Email: {Email}", email);
                return false;
            }
        }

        public async Task<(bool isIdUnique, bool isEmailUnique)> ValidateUniqueness(string identificationNumber, string email)
        {
            try
            {
                var isIdUnique = await IsIdentificationNumberUnique(identificationNumber);
                var isEmailUnique = await IsEmailUnique(email);
                return (isIdUnique, isEmailUnique);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error en validación combinada para ID: {IdentificationNumber}, Email: {Email}", identificationNumber, email);
                return (false, false);
            }
        }
    }
}
