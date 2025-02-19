using System;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class StoreContext(DbContextOptions options) : IdentityDbContext<User>(options)
{
    public required DbSet<Product> Products { get; set; }
    public required DbSet<Basket> Baskets { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<IdentityRole>()
        .HasData(
            new IdentityRole { Id = "620bc7f4-75e2-48e9-98be-46ac5c4f92cf", Name = "Member", NormalizedName = "MEMBER" },
            new IdentityRole { Id = "8abafb15-058e-4efc-9671-146cb9ba50e8", Name = "Admin", NormalizedName = "ADMIN" }
        );
    }
}
