using Application.Interfaces;
using Application.Models.Requests;
using Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

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

            await _userService.SignUpUser(request);
            return Ok();

        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UserUpdateRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                await _userService.UpdateUser(request, id);
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
        public async Task<IActionResult> ChangeRole(int id, [FromBody] RoleChangeRequest request)
        {
            if (id != request.UserId)
                return BadRequest(new { Message = "El id de ruta y el cuerpo deben coincidir." });

            try
            {
                await _userService.ChangeUserRole(request);
                return NoContent();
            }
            catch (ArgumentNullException)
            {
                return NotFound(new { Message = "Usuario no encontrado." });
            }
        }

        // Inactivar un usuario (Admin) 
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Deactivate(int id)
        {
            try
            {
                await _userService.DesactiveUser(id);
                return NoContent();
            }
            catch (ArgumentNullException)
            {
                return NotFound(new { Message = "Usuario no encontrado." });
            }
        }

        // Eliminar un usuario (Admin)
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}/hard")]
        public async Task<IActionResult> HardDelete(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
                return NotFound(new { Message = "Usuario no encontrado." });

            await _userRepository.DeleteAsync(user);
            return NoContent();
        }

        // Listar todos los usuarios (Admin)
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userService.GetUsers();
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

        [Authorize]
        [HttpPatch("cambiar-prestador")]
        public async Task<IActionResult> CambiarRolAPrestador()
        {
            var idClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (idClaim == null)
                return Unauthorized(new { Message = "ID de usuario no encontrado en el token." });

            var userId = int.Parse(idClaim.Value);

            var request = new RoleChangeRequest
            {
                UserId = userId,
                NewRole = "Prestador"
            };

            try
            {
                await _userService.ChangeUserRole(request);
                return Ok(new { Message = "El rol fue actualizado a Prestador." });
            }
            catch (ArgumentNullException)
            {
                return NotFound(new { Message = "Usuario no encontrado." });
            }
        }

        [Authorize]
        [HttpGet("claims")]
        public IActionResult GetClaims()
        {
            var claims = User.Claims.Select(c => new { c.Type, c.Value }).ToList();
            return Ok(claims);
        }
        [Authorize(Roles = "Admin")]
        [HttpPut("admin/{id}")]
        //public async Task<IActionResult> AdminUpdateUser(int id, [FromBody] AdminUserUpdateRequest request)
        //{
        //    if (!ModelState.IsValid)
        //        return BadRequest(ModelState);

        //    try
        //    {
        //        var result = await _userService.AdminUpdateUserAsync(id, request);
        //        if (!result)
        //            return NotFound(new { Message = "Usuario no encontrado." });

        //        return Ok(new { Message = "Usuario actualizado correctamente." });
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, new { Message = $"Error al actualizar el usuario: {ex.Message}" });
        //    }
        //}

        public async Task<IActionResult> AdminUpdateUser(int id, [FromBody] AdminUserUpdateRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _userService.AdminUpdateUserAsync(id, request);

            if (!result)
                throw new KeyNotFoundException("Usuario no encontrado.");
            return Ok(new { Message = "Usuario actualizado correctamente." });
        }

        [HttpPut("toggle-status/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ToggleStatus(int id)
        {
            var result = await _userService.ToggleStatusAsync(id);
            if (!result)
                return NotFound(new { error = $"Usuario con ID {id} no encontrado" });
            return Ok(new { message = "Estado del usuario actualizado correctamente" });
        }
        //descartado
        //[Authorize]
        //[HttpPut("me")]
        //public async Task<IActionResult> UpdateOwnUser([FromBody] UpdateOwnUserDto dto)
        //{
        //    var userId = int.Parse(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value ?? "");
        //    var response = await _userService.UpdateOwnProfileAsync(userId, dto);

        //    if (!response)
        //        return NotFound("No se encontró el usuario o no se pudo actualizar");

        //    return Ok("Perfil actualizado correctamente");
        //}


    }
}