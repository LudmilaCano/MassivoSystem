using Domain.Entities;
using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infraestructure.Data
{
    public class PaymentRepository : RepositoryBase<Payment>, IPaymentRepository  
    {
        public PaymentRepository(ApplicationDbContext context) : base(context)
        {
        }
    }
}
