using Application.Models.Requests;
using Application.Models.Responses;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IBookingService
    {
        Task<BookingDto> AddBookingAsync(AddBookingRequest addBookingRequest);
        Task CancelBookingAsync(int bookingId);
        Task<BookingDto?> GetBookingByIdAsync(int id);
        Task<List<BookingDto>> GetBookingByUserAsync(int userId);
        Task<List<BookingDto>> GetBookingsAsync();
        Task NotificarReservasProximasAsync();


    }
}
