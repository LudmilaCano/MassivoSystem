using Domain.Entities;

namespace Domain.Interfaces
{
    public interface IReviewRepository : IRepositoryBase<Review>
    {
        Task<List<Review>> GetReviewsByUserIdAsync(int userId);
        Task<List<Review>> GetReviewsByEventVehicleAsync(int eventVehicleId);
        Task<Review?> GetReviewByUserAndEventVehicleAsync(int userId, int eventVehicleId);
        Task<bool> UserHasCompletedBookingForEventVehicleAsync(int userId, int eventVehicleId);
        Task<double> GetAverageScoreByEventVehicleAsync(int eventVehicleId);
        Task<int> GetReviewCountByEventVehicleAsync(int eventVehicleId);
        Task<Review?> GetByIdWithRelationsAsync(int reviewId);
    }
}