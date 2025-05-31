using Application.Interfaces;
using Application.Models.Requests;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MassivoProject.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthenticationService _authenticationService;
        public AuthenticationController(IAuthenticationService authenticationService)
        {
            _authenticationService = authenticationService;
        }
        [HttpPost("authenticate")]
        public IActionResult Authentication([FromBody] UserLoginRequest userLoginRequest)
        {
            string token = _authenticationService.Authenticate(userLoginRequest);
            return Ok(token);
        }
    }
}
