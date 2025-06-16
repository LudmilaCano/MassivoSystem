using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infraestructure.Data
{
    public class ReviewRepository : RepositoryBase<Review>, IReviewRepository
    {
        private readonly ApplicationDbContext _context;

        public ReviewRepository(ApplicationDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<List<Review>> GetReviewsByUserIdAsync(int userId)
        {
            return await _context.Set<Review>()
                .Where(r => r.UserId == userId)
                .Include(r => r.User)
                .Include(r => r.EventVehicle)
                    .ThenInclude(ev => ev.Event)
                .Include(r => r.EventVehicle)
                    .ThenInclude(ev => ev.Vehicle)
                .OrderByDescending(r => r.Date)
                .ToListAsync();
        }

        public async Task<List<Review>> GetReviewsByEventVehicleAsync(int eventVehicleId)
        {
            return await _context.Set<Review>()
                .Where(r => r.EventVehicleId == eventVehicleId)
                .Include(r => r.User)
                .Include(r => r.EventVehicle)
                    .ThenInclude(ev => ev.Event)
                .Include(r => r.EventVehicle)
                    .ThenInclude(ev => ev.Vehicle)
                .OrderByDescending(r => r.Date)
                .ToListAsync();
        }

        public async Task<Review?> GetReviewByUserAndEventVehicleAsync(int userId, int eventVehicleId)
        {
            return await _context.Set<Review>()
                .Where(r => r.UserId == userId && r.EventVehicleId == eventVehicleId)
                .Include(r => r.User)
                .Include(r => r.EventVehicle)
                    .ThenInclude(ev => ev.Event)
                .Include(r => r.EventVehicle)
                    .ThenInclude(ev => ev.Vehicle)
                .FirstOrDefaultAsync();
        }

        public async Task<bool> UserHasCompletedBookingForEventVehicleAsync(int userId, int eventVehicleId)
        {
            return await _context.Set<Booking>()
                .AnyAsync(b => b.UserId == userId
                              && b.EventVehicleId == eventVehicleId
                              && b.BookingStatus == BookingStatus.Completed);
        }

        public async Task<double> GetAverageScoreByEventVehicleAsync(int eventVehicleId)
        {
            var reviews = await _context.Set<Review>()
                .Where(r => r.EventVehicleId == eventVehicleId)
                .ToListAsync();

            return reviews.Any() ? reviews.Average(r => r.Score) : 0;
        }

        public async Task<int> GetReviewCountByEventVehicleAsync(int eventVehicleId)
        {
            return await _context.Set<Review>()
                .CountAsync(r => r.EventVehicleId == eventVehicleId);
        }

        public async Task<Review?> GetByIdWithRelationsAsync(int reviewId)
        {
            return await _context.Set<Review>()
                .Where(r => r.ReviewId == reviewId)
                .Include(r => r.User)
                .Include(r => r.EventVehicle)
                    .ThenInclude(ev => ev.Event)
                .Include(r => r.EventVehicle)
                    .ThenInclude(ev => ev.Vehicle)
                .FirstOrDefaultAsync();
        }
    }
}