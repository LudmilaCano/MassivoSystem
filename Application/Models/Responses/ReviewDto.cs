using Domain.Entities;

namespace Application.Models.Responses
{
    public class ReviewDto
    {
        public int ReviewId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int EventVehicleId { get; set; }
        public int Score { get; set; }
        public string Comments { get; set; } = string.Empty;
        public DateTime Date { get; set; }

        // EventVehicle information
        public string? EventName { get; set; }
        public string? VehicleName { get; set; }
        public string? LicensePlate { get; set; }

        public static ReviewDto Create(Review review)
        {
            return new ReviewDto
            {
                ReviewId = review.ReviewId,
                UserId = review.UserId,
                UserName = $"{review.User?.FirstName} {review.User?.LastName}".Trim(),
                EventVehicleId = review.EventVehicleId,
                Score = review.Score,
                Comments = review.Comments,
                Date = review.Date,
                EventName = review.EventVehicle?.Event?.Name,
                VehicleName = review.EventVehicle?.Vehicle?.Name,
                LicensePlate = review.EventVehicle?.LicensePlate
            };
        }
    }

    public class ReviewSummaryDto
    {
        public int EventVehicleId { get; set; }
        public double AverageScore { get; set; }
        public int TotalReviews { get; set; }
        public List<ReviewDto> Reviews { get; set; } = new List<ReviewDto>();
    }
}