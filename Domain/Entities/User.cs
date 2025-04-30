using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
﻿using System.ComponentModel.DataAnnotations;
using Domain.Enums;

namespace Domain.Entities
{
    public class User
    {
        [Key]
        
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateOnly BirthDate { get; set; }
        public string IdentificationNumber { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string City { get; set; }
        public string Province { get; set; }
        public string Role { get; set; }
        public EntityState IsActive { get; set; } = EntityState.Active;

        public User() {

            Role = "User";
        }
        public User(string firstName, string lastName, DateOnly birthDate, string identificationNumber, string email, string password, string city, string province, string userType)
        {
            FirstName = firstName;
            LastName = lastName;
            BirthDate = birthDate;
            IdentificationNumber = identificationNumber;
            Email = email;
            Password = password;
            City = city;
            Province = province;
            Role = userType ?? "User";

        }
    }
}
