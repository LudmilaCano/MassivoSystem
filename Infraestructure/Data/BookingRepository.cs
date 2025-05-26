using Domain.Entities;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infraestructure.Data
{
    public class BookingRepository : RepositoryBase<Booking>, IBookingRepository
    {
        private readonly ApplicationDbContext _context;

        public BookingRepository(ApplicationDbContext context) : base(context)
        {
            _context = context;
        }

        public Task<List<Booking>> GetBookingByUserIdAsync(int userId)
        {
            return _context.Set<Booking>()
                .Where(b => b.UserId == userId)
                .ToListAsync();
        }

        public Task<List<Booking>> GetBookingWithEventVehicleIdAsync(int id)
        {
            return _context.Set<Booking>()
                .Where(b => b.Id == id)
                .Include(b => b.EventVehicle)
                .ToListAsync();
        }
    }
}
