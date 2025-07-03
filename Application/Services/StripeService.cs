using Stripe;
using Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.Services
{
    public class StripeService : IStripeService
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public StripeService(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
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

                // ✅ CONSTRUIR URL COMPLETA DINÁMICAMENTE
                var request = _httpContextAccessor.HttpContext?.Request;
                var baseUrl = $"{request?.Scheme}://{request?.Host}";
                var successUrl = $"{baseUrl}/booking-list";

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
                            Url = successUrl,
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