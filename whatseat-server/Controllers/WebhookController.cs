using Microsoft.AspNetCore.Mvc;
using Stripe;
using Stripe.Checkout;
using whatseat_server.Models;
using whatseat_server.Services;
using Order = whatseat_server.Models.Order;
using OrderService = whatseat_server.Services.OrderService;

namespace whatseat_server.Controllers;
[ApiController]
[Route("[controller]")]
public class WebhookController : Controller
{
  private readonly OrderService _orderService;
  private readonly IConfiguration _configuration;
  public WebhookController(OrderService orderService, IConfiguration configuration)
  {
    _orderService = orderService;
    _configuration = configuration;
  }
  [HttpPost]
  public async Task<IActionResult> Index()
  {
    var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
    string endpointSecret = _configuration["StripeEndPointSecret"];
    try
    {
      var stripeEvent = EventUtility.ParseEvent(json);
      var signatureHeader = Request.Headers["Stripe-Signature"];

      stripeEvent = EventUtility.ConstructEvent(json, signatureHeader, endpointSecret);

      if (stripeEvent.Type == Events.PaymentIntentSucceeded)
      {
        var paymentIntent = stripeEvent.Data.Object as PaymentIntent;
        System.Diagnostics.Debug.WriteLine($"\n ////////////\n{paymentIntent.Id}\n");
        Order order = await _orderService.FindOrderBySessionId(paymentIntent.Id);
        System.Diagnostics.Debug.WriteLine($"\n ////////////\n{order.OrderId}\n");
        await _orderService.PayOrder(order);

        return Ok();
      }
      return Ok();
    }
    catch (StripeException)
    {
      return BadRequest();
    }
    catch (Exception)
    {
      return StatusCode(500);
    }
  }
}