using Stripe;
using Application.Interfaces;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Services
{
    public class StripeService : IStripeService
    {
        private readonly IConfiguration _configuration;

        public StripeService(IConfiguration configuration)
        {
            _configuration = configuration;
            StripeConfiguration.ApiKey = _configuration["Stripe:SecretKey"];
        }

        public async Task<string> CreatePaymentLinkAsync(decimal amount, int eventVehicleId, string description = null)
        {
            try
            {
                var priceOptions = new PriceCreateOptions
                {
                    UnitAmount = (long)(amount * 100),
                    Currency = "ars", 
                    ProductData = new PriceProductDataOptions
                    {
                        Name = description ?? "Reserva de viaje - Massivo App",
                    },
                };

                var priceService = new PriceService();
                var price = await priceService.CreateAsync(priceOptions);
                var url = "https://localhost:5173/booking-list";

                var paymentLinkOptions = new PaymentLinkCreateOptions
                {
                    LineItems = new List<PaymentLinkLineItemOptions>
                    {
                        new PaymentLinkLineItemOptions
                        {
                            Price = price.Id,
                            Quantity = 1,
                        },
                    },
                    AfterCompletion = new PaymentLinkAfterCompletionOptions
                    {
                        Type = "redirect",
                        Redirect = new PaymentLinkAfterCompletionRedirectOptions
                        {
                            Url = url, 
                        },
                    },
                };

                var paymentLinkService = new PaymentLinkService();
                var paymentLink = await paymentLinkService.CreateAsync(paymentLinkOptions);

                return paymentLink.Url;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error creating Stripe payment link: {ex.Message}");
            }
        }
    }
}

