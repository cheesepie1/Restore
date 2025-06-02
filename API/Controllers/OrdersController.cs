using System;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Entities.OrderAggregate;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

// Only authorized users can access this controller
[Authorize]
public class OrdersController(StoreContext context) : BaseApiController
{
    // Retrieves all orders for the currently authenticated user.
    [HttpGet]
    public async Task<ActionResult<List<OrderDto>>> GetOrders()
    {
        var orders = await context.Orders
            // Projects Order entities to OrderDto using AutoMapper
            .ProjectToDto()
            .Where(x => x.BuyerEmail == User.GetUsername())
            .ToListAsync();
        return orders;
    }
    // Retrieves details of a specific order by ID, only if it belongs to the current user.
    [HttpGet("{id:int}")]
    public async Task<ActionResult<OrderDto>> GetOrderDetails(int id)
    {
        var order = await context.Orders
            .ProjectToDto()
            .Where(x => x.BuyerEmail == User.GetUsername() && id == x.Id)
            .FirstOrDefaultAsync();
        if (order == null) return NotFound();
        return order;
    }

    // Creates a new order from the user's basket.
    [HttpPost]
    public async Task<ActionResult<Order>> CreateOrder(CreateOrderDto orderDto)
    {
        // Retrieve basket from cookies
        var basket = await context.Baskets.GetBasketWithItems(Request.Cookies["basketId"]);
        // Validate basket existence and content. If no paymentIntendId, the order is considered failed.
        if (basket == null || basket.Items.Count == 0 || string.IsNullOrEmpty(basket.PaymentIntentId))
            return BadRequest("Basket is empty or not found");
        // Convert basket items to order items
        var items = CreateOrderItems(basket.Items);
        if (items == null) return BadRequest("some items out of stock");
        // Calculate order cost
        var subtotal = items.Sum(x => x.Price * x.Quantity);
        var deliveryFee = CalculateDeliveryFee(subtotal);

        // Check for existing order with the same payment intent (idempotency)
        var order = await context.Orders
            .Include(x => x.OrderItems)
            .FirstOrDefaultAsync(x => x.PaymentIntentId == basket.PaymentIntentId);

        if (order == null)
        {
            order = new Order
            {
                OrderItems = items,
                BuyerEmail = User.GetUsername(),
                ShippingAddress = orderDto.ShippingAddress,
                DeliveryFee = deliveryFee,
                Subtotal = subtotal,
                PaymentSummary = orderDto.PaymentSummary,
                PaymentIntentId = basket.PaymentIntentId
            };

             context.Orders.Add(order);
        }
         // Update existing order items (e.g., in retry situations)
        else
        {
            order.OrderItems = items;
        }

         // Save changes to database
        var result = await context.SaveChangesAsync() > 0;

        if (!result) return BadRequest("Problem creating order");
        return CreatedAtAction(nameof(GetOrderDetails), new { id = order.Id }, order.ToDto());
    }

    // Calculates delivery fee based on subtotal.
    private long CalculateDeliveryFee(long subtotal)
    {
        if (subtotal > 10000) return 0;
        return 500;
    }

    // Converts basket items to order items. Reduces product stock accordingly.
    private List<OrderItem>? CreateOrderItems(List<BasketItem> items)
    {
        var orderItems = new List<OrderItem>();

        foreach (var item in items)
        {
            // Check stock availability
            if (item.Product.QuantityInStock < item.Quantity)
                return null;

            var orderItem = new OrderItem
            {
                ItemOrdered = new ProductItemOrdered
                {
                    ProductId = item.ProductId,
                    PictureUrl = item.Product.PictureUrl,
                    Name = item.Product.Name

                },
                Price = item.Product.Price,
                Quantity = item.Quantity

            };
            orderItems.Add(orderItem);
            // Decrease stock for each product
            item.Product.QuantityInStock -= item.Quantity;

        }
        return orderItems;
    }
}
