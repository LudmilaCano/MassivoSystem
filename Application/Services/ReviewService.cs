using Application.Interfaces;
using Application.Models.Requests;
using Application.Models.Responses;
using Domain.Entities;
using Domain.Interfaces;

namespace Application.Services
{
    public class ReviewService : IReviewService
    {
        private readonly IReviewRepository _reviewRepository;
        private readonly IUserRepository _userRepository;
        private readonly IEventRepository _eventRepository;

        public ReviewService(
            IReviewRepository reviewRepository,
            IUserRepository userRepository,
            IEventRepository eventRepository)
        {
            _reviewRepository = reviewRepository;
            _userRepository = userRepository;
            _eventRepository = eventRepository;
        }

        public async Task<ReviewDto> CreateReviewAsync(CreateReviewRequest request)
        {
            var user = await _userRepository.GetByIdAsync(request.UserId);
            if (user == null)
            {
                throw new KeyNotFoundException($"Usuario con ID {request.UserId} no encontrado.");
            }

            var canReview = await CanUserReviewEventVehicleAsync(request.UserId, request.EventVehicleId);
            if (!canReview)
            {
                throw new InvalidOperationException("No puedes hacer una reseña sin haber completado una reserva para este evento-vehículo.");
            }

            var existingReview = await _reviewRepository.GetReviewByUserAndEventVehicleAsync(
                request.UserId, request.EventVehicleId);
            if (existingReview != null)
            {
                throw new InvalidOperationException("Ya has hecho una reseña para este evento-vehículo.");
            }

            var review = new Review
            {
                UserId = request.UserId,
                EventVehicleId = request.EventVehicleId,
                Score = request.Score,
                Comments = request.Comments,
                Date = DateTime.Now
            };

            var createdReview = await _reviewRepository.AddAsync(review);

            var reviewWithRelations = await _reviewRepository.GetByIdWithRelationsAsync(createdReview.ReviewId);
            return ReviewDto.Create(reviewWithRelations!);
        }

        public async Task<ReviewDto> UpdateReviewAsync(int reviewId, UpdateReviewRequest request, int userId)
        {
            var review = await _reviewRepository.GetByIdAsync(reviewId);
            if (review == null)
            {
                throw new KeyNotFoundException($"Reseña con ID {reviewId} no encontrada.");
            }

            if (review.UserId != userId)
            {
                throw new UnauthorizedAccessException("Solo puedes editar tus propias reseñas.");
            }

            review.Score = request.Score;
            review.Comments = request.Comments;
            review.Date = DateTime.Now;

            await _reviewRepository.UpdateAsync(review);

            var updatedReview = await _reviewRepository.GetByIdWithRelationsAsync(reviewId);
            return ReviewDto.Create(updatedReview!);
        }

        public async Task DeleteReviewAsync(int reviewId, int userId)
        {
            var review = await _reviewRepository.GetByIdAsync(reviewId);
            if (review == null)
            {
                throw new KeyNotFoundException($"Reseña con ID {reviewId} no encontrada.");
            }

            if (review.UserId != userId)
            {
                throw new UnauthorizedAccessException("Solo puedes eliminar tus propias reseñas.");
            }

            await _reviewRepository.DeleteAsync(review);
        }

        public async Task<ReviewDto?> GetReviewByIdAsync(int reviewId)
        {
            var review = await _reviewRepository.GetByIdWithRelationsAsync(reviewId);
            return review != null ? ReviewDto.Create(review) : null;
        }

        public async Task<List<ReviewDto>> GetReviewsByUserAsync(int userId)
        {
            var reviews = await _reviewRepository.GetReviewsByUserIdAsync(userId);
            return reviews.Select(ReviewDto.Create).ToList();
        }

        public async Task<ReviewSummaryDto> GetReviewsByEventVehicleAsync(int eventVehicleId)
        {
            var reviews = await _reviewRepository.GetReviewsByEventVehicleAsync(eventVehicleId);
            var averageScore = await _reviewRepository.GetAverageScoreByEventVehicleAsync(eventVehicleId);
            var totalReviews = await _reviewRepository.GetReviewCountByEventVehicleAsync(eventVehicleId);

            return new ReviewSummaryDto
            {
                EventVehicleId = eventVehicleId,
                AverageScore = Math.Round(averageScore, 2),
                TotalReviews = totalReviews,
                Reviews = reviews.Select(ReviewDto.Create).ToList()
            };
        }

        private async Task<bool> CanUserReviewEventVehicleAsync(int userId, int eventVehicleId)
        {
            return await _reviewRepository.UserHasCompletedBookingForEventVehicleAsync(userId, eventVehicleId);
        }
    }
}