using Application.Models.Responses;
using Domain.Entities;
using Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class BookingService
    {
        private readonly IBookingRepository _bookingRepository;
        public BookingService(IBookingRepository bookingRepository)
        {
            _bookingRepository = bookingRepository;
        }

        public async Task<List<BookingDto>> GetBookings()
        {
            var bookings = await _bookingRepository.ListAsync() ?? new List<Booking>();
            var bookingDtos = new List<BookingDto>();
            foreach (var item in bookings)
            {
                var bookingDto = new BookingDto
                {
                    Id = item.Id,
                    Date = item.Date,
                    User = item.User,
                    EventVehicle = item.EventVehicle,
                    Payment = item.Payment,
                    BookingStatus = item.BookingStatus,
                    SeatNumber = item.SeatNumber
                };
                bookingDtos.Add(bookingDto);
            }
            return bookingDtos;
        }

        public async Task<BookingDto?> GetBookingById(int id)
        {
            var booking = await _bookingRepository.GetByIdAsync(id);
            if (booking != null)
            {
                var bookingDto = new BookingDto
                {
                    Id = booking.Id,
                    Date = booking.Date,
                    User = booking.User,
                    EventVehicle = booking.EventVehicle,
                    Payment = booking.Payment,
                    BookingStatus = booking.BookingStatus,
                    SeatNumber = booking.SeatNumber
                };
                return bookingDto;
            }
            return null;
        }

        public async Task<List<BookingDto>> GetBookingByUser(int userId)
        {
            var bookings = await _bookingRepository.GetBookingByUserIdAsync(userId);
            var bookingDtos = new List<BookingDto>();
            if (bookings != null)
            {
                foreach (var booking in bookings)
                {
                    var bookingDto = new BookingDto
                    {
                        Id = booking.Id,
                        Date = booking.Date,
                        User = booking.User,
                        EventVehicle = booking.EventVehicle,
                        Payment = booking.Payment,
                        BookingStatus = booking.BookingStatus,
                        SeatNumber = booking.SeatNumber
                    };
                    bookingDtos.Add(bookingDto);
                }
            }
            return bookingDtos;
        }

        public async Task<BookingDto> AddBooking(BookingDto bookingDto)
        {
            var booking = new Booking
            {
                Date = bookingDto.Date,
                UserId = bookingDto.User.Id,
                EventVehicleId = bookingDto.EventVehicle.Id,
                PaymentId = bookingDto.Payment.Id,
                BookingStatus = bookingDto.BookingStatus,
                SeatNumber = bookingDto.SeatNumber
            };
            await _bookingRepository.AddAsync(booking);
            return bookingDto;
        }
    }
}
