using API.Data;
using API.DTO;
using API.Entities.OrderAggregate;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace API.Controllers
{
    public class PaymentsController : BaseApiController
    {
        private readonly PaymentService _paymentService;
        private readonly StoreContext _context;
        private readonly IConfiguration _config;

        public PaymentsController(PaymentService paymentService, StoreContext context, IConfiguration config) 
        {
            _paymentService = paymentService;
            _context = context;
            _config = config;
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<BasketDto>> CreateOrUpdatePaymentIntent()
        {
            var basket = await _context.Baskets
                .RetrieveBasketWithItems(User.Identity.Name)
                .FirstOrDefaultAsync();

            if (basket == null)   return NotFound();

            var intent = await _paymentService.CreateOrUpdatePaymentIntent(basket);

            if (intent == null) return BadRequest(new ProblemDetails{ Title = "Problem creating payment intent" });

            //jika paymentintenId atau clientScret gak ada maka akan menggunakan intent.id atau intent.clientSecret yang dibuat
            basket.PaymentIntentId = string.IsNullOrEmpty(basket.PaymentIntentId) ? intent.Id : basket.PaymentIntentId;
            basket.ClientSecret = string.IsNullOrEmpty(basket.ClientSecret) ? intent.ClientSecret : basket.ClientSecret;

            //memperbarui basket dengan paymentintent dan clientsecret
            _context.Update(basket);

            var result = await _context.SaveChangesAsync() > 0;

            if (!result) return BadRequest(new ProblemDetails { Title = "Problem updating basket with intent" });
            
            return basket.MapBasketToDto();
        }


        [HttpPost("webhook")]
        public async Task<ActionResult> StripeWebhook()
        {
            //pada endpoint ini kita akan membaca request dari stripe ketika payment berhasil diterima
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync(); //membaca request http
            //Stripe akan mengirim whSecret melalui request headers kemudian kita bandingkan whsecret yang dikirim ke request headers
            //dengan yang di configurasi appsettings developement
            var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"],
                _config["StripeSettings:WhSecret"]);

            var charge = (Charge)stripeEvent.Data.Object;

            var order = await _context.Orders.FirstOrDefaultAsync(x => x.PaymentIntentId == charge.PaymentIntentId);
            if (charge.Status == "succeeded") order.OrderStatus = OrderStatus.PaymentReceived;

            await _context.SaveChangesAsync();

            //mereturn empty result agar stripe mengetahui kalo kita berhasil menerima webhooksnya.
            return new EmptyResult();
        }
    }
}
