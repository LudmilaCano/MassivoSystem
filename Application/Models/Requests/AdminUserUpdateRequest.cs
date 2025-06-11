using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Requests
{
    public class AdminUserUpdateRequest
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateOnly BirthDate { get; set; }
        public string IdentificationNumber { get; set; }
        public string Email { get; set; }
        public int? CityId { get; set; }
        public int? ProvinceId { get; set; }
        public string Role { get; set; }
    }
}
