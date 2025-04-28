using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using System;
using System.Threading.Tasks;
using Application.Interfaces;
using Application.Models.Requests;
using Domain.Interfaces;

namespace MassivoApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IAuthenticationService _authService;
        private readonly IUserUniquenessChecker _uniquenessChecker;
        private readonly IUserRepository _userRepository;

        public UsersController(
            IUserService userService,
            IAuthenticationService authService,
            IUserUniquenessChecker uniquenessChecker,
            IUserRepository userRepository)
        {
            _userService = userService;
            _authService = authService;
            _uniquenessChecker = uniquenessChecker;
            _userRepository = userRepository;
        }

        // Regitrar nuevo usuario

        [HttpPost("signup")]
        public async Task<IActionResult> SignUp([FromBody] UserSignUpRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var (isIdUnique, isEmailUnique) = await _uniquenessChecker.ValidateUniqueness(request.DniNumber, request.Email!);
            if (!isIdUnique)
                return Conflict(new { Message = "El DNI ya está registrado." });
            if (!isEmailUnique)
                return Conflict(new { Message = "El email ya está registrado." });

            _userService.SignUpUser(request);
            return StatusCode(StatusCodes.Status201Created, new { Message = "Usuario registrado correctamente." });
        }


        // Autenticacion de usuario y retorno de token JWT

        [HttpPost("login")]
        public IActionResult Login([FromBody] UserLoginRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var token = _authService.Authenticate(request);
                return Ok(new { Token = token });
            }
            catch (Exception)
            {
                return Unauthorized(new { Message = "Credenciales inválidas." });
            }
        }


        // Actualizar datos de un usuario existente

        [Authorize]
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] UserUpdateRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                _userService.UpdateUser(request, id);
                return NoContent();
            }
            catch (ArgumentNullException)
            {
                return NotFound(new { Message = "Usuario no encontrado." });
            }
        }

        // Cambiar el rol de un usuario (Admin)

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/role")]
        public IActionResult ChangeRole(int id, [FromBody] RoleChangeRequest request)
        {
            if (id != request.UserId)
                return BadRequest(new { Message = "El id de ruta y el cuerpo deben coincidir." });

            try
            {
                _userService.ChangeUserRole(request);
                return NoContent();
            }
            catch (ArgumentNullException)
            {
                return NotFound(new { Message = "Usuario no encontrado." });
            }
        }


        // Inactivar un usuario (Admin) "Faltaria agregar en IUserServices"

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public IActionResult Deactivate(int id)
        {
            try
            {
                _userService.DeactivateUser(id); 
                return NoContent();
            }
            catch (ArgumentNullException)
            {
                return NotFound(new { Message = "Usuario no encontrado." });
            }
        }


        // Listar todos los usuarios (Admin) "Faltaria agregar en IUserRepository"

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userRepository.GetAllAsync();
            return Ok(users);
        }


        // Traer datos de un usuario por su ID

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
                return NotFound(new { Message = "Usuario no encontrado." });

            return Ok(user);
        }
    }
}

