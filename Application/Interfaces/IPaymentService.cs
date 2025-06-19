using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IPaymentService
    {
        Task<string> CrearPreferenciaPagoAsync(string accessToken, string title, decimal amount, string externalReference, string successUrl, string failureUrl);
    }
}
