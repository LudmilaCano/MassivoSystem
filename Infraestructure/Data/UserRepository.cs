using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;

namespace Infraestructure.Data
{
    public class UserRepository : EfRepository<User>
    {
        public UserRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
