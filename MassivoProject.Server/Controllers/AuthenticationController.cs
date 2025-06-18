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
            var result = _authenticationService.Authenticate(userLoginRequest);

            if (string.IsNullOrEmpty(result.Token))
            {
                return Unauthorized(new { error = result.Message });
            }
            return Ok(result);
        }


        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            var result = await _userService.GenerateRecoveryCodeAndSendEmailAsync(request.Email);
            return Ok(); // Siempre devolvé OK para no exponer si el correo existe o no
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordWithCodeRequest request)
        {
            var result = await _userService.ResetPasswordWithRecoveryCodeAsync(
                request.Email, request.RecoveryCode, request.NewPassword
            );

            if (!result)
                return BadRequest(new { error = "Datos inválidos" });

            return Ok(new { message = "Contraseña actualizada con éxito" });
        }


        [HttpPost("activate")]
        public async Task<IActionResult> ActivateUser([FromBody] ActivateUserRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest("Datos inválidos");

            var result = await _userService.ActivateAccountAsync(request.email, request.recoveryCode);

            if (!result)
                return BadRequest(new { Message = "El código es inválido o la cuenta ya está activada." });

            return Ok(new { Message = "✅ Cuenta activada correctamente. Ya podés iniciar sesión." });
        }


    }
}
