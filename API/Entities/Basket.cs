using System;
using System.Security.Cryptography.X509Certificates;

namespace API.Entities;

public class Basket
{
    public int Id { get; set; }
    public required string BasketId { get; set; }
    public List<BasketItem> Items { get; set; } = [];
    public string? ClientSecret { get; set; }
    public string? PaymentIntentId { get; set; }

    public void AddItem(Product product, int quantity)
    {
        if (product == null) ArgumentNullException.ThrowIfNull(product);
        if (quantity <= 0) throw new ArgumentException("Quantity should be greater than zero", nameof(quantity));

        var existingItem = FindItem(product.Id);
        if (existingItem == null)
        {
            Items.Add(new BasketItem
            {
                Product = product,
                Quantity = quantity,

            });
        }
        else
        {
            existingItem.Quantity += quantity;
        }
    }

    public void RemoveItem(int productId, int quantity)
    {
        if (quantity <= 0) throw new ArgumentException("quantity should be greater than zero", nameof(quantity));
        var item = FindItem(productId);
        if (item == null) return;

        item.Quantity -= quantity;
        if (item.Quantity <= 0) Items.Remove(item);
    }


    private BasketItem? FindItem(int ProductId)
    {
        return Items.FirstOrDefault(item => item.ProductId == ProductId);
    }
}
