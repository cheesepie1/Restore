using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace API.Middleware;

// Custom middleware to catch unhandled exceptions globally and return a structured error response.
public class ExceptionMiddleware(IHostEnvironment env, ILogger<ExceptionMiddleware> logger) : IMiddleware
{
    // Main middleware entry point. Catches any exceptions thrown during request processing.
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            await HandleException(context, ex);
        }
    }



 // Handles the exception and writes a custom JSON error response to the client.
    private async Task HandleException(HttpContext context, Exception ex)
    {
        logger.LogError(ex, ex.Message);
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

        var response = new ProblemDetails
        {
            Status = 500,
            Detail = env.IsDevelopment() ? ex.StackTrace?.ToString() : null,
            Title = ex.Message
        };
        // Use camelCase naming in the JSON response for consistency with JavaScript clients.
        var options = new JsonSerializerOptions
        { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

        // Serialize the ProblemDetails object to JSON and write it to the response body.
        var json = JsonSerializer.Serialize(response, options);
        await context.Response.WriteAsync(json);


    }
}
