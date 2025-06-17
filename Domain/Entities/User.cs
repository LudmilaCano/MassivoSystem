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
        //public string City { get; set; }
        //public string Province { get; set; }
        public int? CityId { get; set; }
        public City City { get; set; }

        public int? ProvinceId { get; set; }
        public Province Province { get; set; }

        public string Role { get; set; }

        public EntityState IsActive { get; set; } = EntityState.Inactive;
        public ICollection<Event> Events { get; set; }
        public string? RecoveryCode { get; set; }
        public bool MustChangePassword { get; set; } = false;



        public User()
        {

            Role = "User";
            Events = new List<Event>();
        }
        public User(string firstName, string lastName, DateOnly birthDate, string identificationNumber, string email, string password, int city, int province, string userType)
        {
            FirstName = firstName;
            LastName = lastName;
            BirthDate = birthDate;
            IdentificationNumber = identificationNumber;
            Email = email;
            Password = password;
            CityId = city;
            ProvinceId = province;
            Role = userType ?? "User";
            Events = new List<Event>();


        }
    }
}
