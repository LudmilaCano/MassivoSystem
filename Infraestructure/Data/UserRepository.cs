using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;
using Domain.Interfaces;
using Infraestructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infraestructure.Data
{
    public class UserRepository : RepositoryBase<User>, IUserRepository
    {
        public UserRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<bool> ExistsByIdentificationNumberAsync(string identificationNumber)
        {
            return await _dbContext.Set<User>()
                .AnyAsync(u => u.IdentificationNumber == identificationNumber);
        }

        public async Task<bool> ExistsByEmailAsync(string email)
        {
            return await _dbContext.Set<User>()
                .AnyAsync(u => u.Email == email);
        }
    }
}
