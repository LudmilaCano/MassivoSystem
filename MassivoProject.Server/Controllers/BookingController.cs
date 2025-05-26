using Application.Interfaces;
using Application.Models.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MassivoProject.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly IBookingService _bookingService;
        public BookingController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        [HttpGet]
        public async Task<IActionResult> GetBookings()
        {
            var bookings = await _bookingService.GetBookingsAsync();
            return Ok(bookings);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBookingById(int id)
        {
            var booking = await _bookingService.GetBookingByIdAsync(id);
            if (booking == null)
            {
                return NotFound();
            }
            return Ok(booking);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetBookingByUser(int userId)
        {
            var bookings = await _bookingService.GetBookingByUserAsync(userId);
            return Ok(bookings);
        }
        [HttpPost]
        public async Task<IActionResult> AddBooking([FromBody] AddBookingRequest addBookingRequest)
        {
            if (addBookingRequest == null)
            {
                return BadRequest("Invalid booking request.");
            }
            var booking = await _bookingService.AddBookingAsync(addBookingRequest);
            return CreatedAtAction(nameof(GetBookingById), new { id = booking.Id }, booking);
        }
        [HttpDelete("{bookingId}")]
        public async Task<IActionResult> CancelBooking(int bookingId)
        {
            await _bookingService.CancelBookingAsync(bookingId);
            return NoContent();
        }
    }
}
