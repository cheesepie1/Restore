using System;
using API.Data;
using API.DTOs;
using API.Entities.OrderAggregate;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace API.Controllers;

public class PaymentsController(PaymentsService paymentService,
    StoreContext context, IConfiguration config, ILogger<PaymentsController> logger) 
        : BaseApiController
{
    // Creates or updates a Stripe PaymentIntent based on the current basket
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<BasketDto>> CreatOrUpdatePaymentIntent()
    {
        // Retrieve basket using cookie ID
        var basket = await context.Baskets.GetBasketWithItems(Request.Cookies["basketId"]);
        if (basket == null) return BadRequest("Problem with the basket");
         // Create or update PaymentIntent on Stripe
        var intent = await paymentService.CreateOrUpdatePaymentIntent(basket);
        if (intent == null) return BadRequest("Problem creating payment intent");
        // Store PaymentIntent details in the basket (first time only)
        basket.PaymentIntentId ??= intent.Id;
        basket.ClientSecret ??= intent.ClientSecret;

        // Save changes to DB if there are modifications
        if (context.ChangeTracker.HasChanges())
        {

            var result = await context.SaveChangesAsync() > 0;

            if (!result) return BadRequest("Problem updating basket with intent");

        }
         // Return updated basket DTO
        return basket.ToDto();

    }
     // Webhook endpoint for Stripe to notify payment status
    [HttpPost("webhook")]
    public async Task<IActionResult> StripeWebhook()
    {
        // Read raw JSON from Stripe webhook request body
        var json = await new StreamReader(Request.Body).ReadToEndAsync();

        try
        {
            var stripeEvent = ConstructStripeEvent(json);
            // Only process PaymentIntent events
            if (stripeEvent.Data.Object is not PaymentIntent intent)
            {
                return BadRequest("Invalid event data");
            }

            if (intent.Status == "succeeded") await HandlePaymentIntentSucceeded(intent);
            else await HandlePaymentIntentFailed(intent);

            // still need to send ok to stripe, which sends the paymentintent.
            return Ok();
        }
        catch (StripeException ex)
        {
            logger.LogError(ex, "Stripe webhook Error");
            return StatusCode(StatusCodes.Status500InternalServerError, "Webhook error");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An unexpected error has occured");
            return StatusCode(StatusCodes.Status500InternalServerError, "Unexpected error");

        }
    }
     // Handles failed payments - restores product stock and updates order status
    private async Task HandlePaymentIntentFailed(PaymentIntent intent)
    {
        var order = await context.Orders
            .Include(x => x.OrderItems)
            .FirstOrDefaultAsync(x => x.PaymentIntentId == intent.Id)
                ?? throw new Exception("Order not found");
         // Restore stock for failed order
        foreach (var item in order.OrderItems)
        {
            var pproductItem = await context.Products
                .FindAsync(item.ItemOrdered.ProductId)
                    ?? throw new Exception("Problem updating order stock");

            pproductItem.QuantityInStock += item.Quantity;
        }
        order.OrderStatus = OrderStatus.PaymentFailed;
        await context.SaveChangesAsync();

    }
    // Handles successful payments - marks order as paid and deletes basket
    private async Task HandlePaymentIntentSucceeded(PaymentIntent intent)
    {
        var order = await context.Orders
            .Include(x => x.OrderItems)
            .FirstOrDefaultAsync(x => x.PaymentIntentId == intent.Id)
                ?? throw new Exception("Order not found");

        // Validate payment amount matches order total
        if (order.GetTotal() != intent.Amount)
        {
            order.OrderStatus = OrderStatus.PaymentMismatch;
        }
        else
        {
            order.OrderStatus = OrderStatus.PaymentReceived;

        }
        var basket = await context.Baskets.FirstOrDefaultAsync(x => x.PaymentIntentId == intent.Id);
        // Remove basket since it's no longer needed
        if (basket != null) context.Baskets.Remove(basket);

        await context.SaveChangesAsync();

    }

    // Validates and constructs a Stripe event from incoming webhook JSON
    private Event ConstructStripeEvent(string json)
    {
        try
        {
            return EventUtility.ConstructEvent(json,
             Request.Headers["Stripe-Signature"], config["StripeSettings:WhSecret"]);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to construct stripe event");

            throw new StripeException("Invalid signature");
        }
    }
}
