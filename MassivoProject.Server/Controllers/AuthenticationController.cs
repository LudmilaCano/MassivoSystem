using Application.Interfaces;
using Application.Models.Requests;
using Application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ForgotPasswordRequest = Application.Models.Requests.ForgotPasswordRequest;

namespace MassivoProject.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthenticationService _authenticationService;
        private readonly IUserService _userService;
        private readonly IEmailService _emailService;

        public AuthenticationController(IAuthenticationService authenticationService,IUserService userService,IEmailService emailService)
        {
            _authenticationService = authenticationService;
            _userService = userService;
            _emailService = emailService;

        }

        [HttpPost("authenticate")]
        public IActionResult Authentication([FromBody] UserLoginRequest userLoginRequest)
        {

            var token = _authenticationService.Authenticate(userLoginRequest);
            return Ok(token);
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            var result = await _userService.GenerateRecoveryCodeAndSendEmailAsync(request.Email);
            return Ok(); // Siempre devolvé OK para no exponer si el correo existe o no
        }


    }
}
