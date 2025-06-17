using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Responses
{
    public class AuthenticationResult
    {
        public string Token { get; set; } = string.Empty;
        public bool RecoveryMode { get; set; } = false;
        public string Message { get; set; } = string.Empty;
    }
}
