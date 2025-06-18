using Application.Interfaces;
using Application.Models.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MassivoProject.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public ReviewController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateReview([FromBody] CreateReviewRequest request)
        {
            // Valida primero el modelo (sin UserId)
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // Obtener UserId desde el token
                var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
                {
                    return Unauthorized(new { Message = "Usuario no autorizado o token inválido." });
                }

                // Asignar UserId que viene del token
                request.UserId = userId;

                var review = await _reviewService.CreateReviewAsync(request);

                return CreatedAtAction(nameof(GetReviewById), new { id = review.ReviewId }, review);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error interno del servidor.", Details = ex.Message });
            }
        }
    

    [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReview(int id, [FromBody] UpdateReviewRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var userId = int.Parse(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value ?? "");
                var review = await _reviewService.UpdateReviewAsync(id, request, userId);
                return Ok(review);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error interno del servidor.", Details = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            try
            {
                var userId = int.Parse(User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value ?? "");
                await _reviewService.DeleteReviewAsync(id, userId);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error interno del servidor.", Details = ex.Message });
            }
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetReviewById(int id)
        {
            try
            {
                var review = await _reviewService.GetReviewByIdAsync(id);
                if (review == null)
                {
                    return NotFound(new { Message = "Reseña no encontrada." });
                }
                return Ok(review);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error interno del servidor.", Details = ex.Message });
            }
        }

        [HttpGet("user/{userId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetReviewsByUser(int userId)
        {
            try
            {
                var reviews = await _reviewService.GetReviewsByUserAsync(userId);
                return Ok(reviews);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error interno del servidor.", Details = ex.Message });
            }
        }

        [HttpGet("event-vehicle/{eventVehicleId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetReviewsByEventVehicle(int eventVehicleId)
        {
            try
            {
                var reviews = await _reviewService.GetReviewsByEventVehicleAsync(eventVehicleId);
                return Ok(reviews);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error interno del servidor.", Details = ex.Message });
            }
        }
    }
}