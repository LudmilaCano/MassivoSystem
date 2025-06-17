using Application.Models.Requests;
using Application.Models.Responses;

namespace Application.Interfaces
{
    public interface IReviewService
    {
        Task<ReviewDto> CreateReviewAsync(CreateReviewRequest request);
        Task<ReviewDto> UpdateReviewAsync(int reviewId, UpdateReviewRequest request, int userId);
        Task DeleteReviewAsync(int reviewId, int userId);
        Task<ReviewDto?> GetReviewByIdAsync(int reviewId);
        Task<List<ReviewDto>> GetReviewsByUserAsync(int userId);
        Task<ReviewSummaryDto> GetReviewsByEventVehicleAsync(int eventVehicleId);
    }
}