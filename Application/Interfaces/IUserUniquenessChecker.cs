    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;

    namespace Application.Interfaces
    {
        public interface IUserUniquenessChecker
        {
            Task<bool> IsIdentificationNumberUnique(string identificationNumber);
            Task<bool> IsEmailUnique(string email);
            Task<(bool isIdUnique, bool isEmailUnique)> ValidateUniqueness(string identificationNumber, string email);
        }
    }
