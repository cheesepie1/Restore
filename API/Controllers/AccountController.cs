using System;
using System.Runtime.Serialization;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController(SignInManager<User> signInManager) : BaseApiController
{
     // Register a new user account
    [HttpPost("register")]
    public async Task<ActionResult> RegisterUser(RegisterDto registerDto)
    {
        // Create a new user entity using the email as username
        var user = new User { UserName = registerDto.Email, Email = registerDto.Email };
        // Try to create the user in the identity system
        var result = await signInManager.UserManager.CreateAsync(user, registerDto.Password);
         // If creation fails, return validation errors
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }
            return ValidationProblem();

        }
        // Add the new user to the "Member" role
        await signInManager.UserManager.AddToRoleAsync(user, "Member");
        return Ok();

    }

    [HttpGet("user-info")]
    public async Task<ActionResult> GetUserInfo()
    {
        // If user is not authenticated, return 204 No Content
        if (User.Identity?.IsAuthenticated == false) return NoContent();
        // Get the user object based on current authentication
        var user = await signInManager.UserManager.GetUserAsync(User);
        if (user == null) return Unauthorized();
        // Get user's assigned roles
        var roles = await signInManager.UserManager.GetRolesAsync(user);
         // Return user's basic info and role list
        return Ok(new
        {
            user.Email,
            user.UserName,
            Roles = roles
        });
    }

    [HttpPost("logout")]
    public async Task<ActionResult> Logout()
    {
        await signInManager.SignOutAsync();
        return NoContent();
    }

    // Save or update the user's address (authenticated user)
    [HttpPost("address")]
    public async Task<ActionResult<Address>> CreateOrUpdataAddress(Address address)
    {
        // Get current user with address included
        var user = await signInManager.UserManager.Users
            .Include(x => x.Address)
            .FirstOrDefaultAsync(x => x.UserName == User.Identity!.Name);
        if (user == null) return Unauthorized();

        user.Address = address;

        // update addresss info
        var result = await signInManager.UserManager.UpdateAsync(user);
        if (!result.Succeeded) return BadRequest("Problem updating user address");
        return Ok();
    }
    // Get the currently logged-in user's saved address
    [Authorize]
    [HttpGet("address")]
    public async Task<ActionResult<Address>> GetSavedAddress()
    {
        var address = await signInManager.UserManager.Users
            .Where(x => x.UserName == User.Identity!.Name)
            .Select(x => x.Address)
            .FirstOrDefaultAsync();
        if (address == null) return NoContent();
        return address;

    }

}
