namespace Application.Interfaces
{
    public interface IStripeService
    {
        Task<string> CreatePaymentLinkAsync(decimal amount, int eventVehicleId, string description = null);
    }
}