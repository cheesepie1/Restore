using System;
using System.Security.Claims;

namespace API.Extensions;

public static class ClaimsPrincipleExtensions
{
    public static string GetUsername(this ClaimsPrincipal user)
    {
        // Return the name from the Identity object, or throw if not available
        return user.Identity?.Name ?? throw new UnauthorizedAccessException();
    }

}
