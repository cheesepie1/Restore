using System;
using System.Text.Json;
using API.RequestHelpers;
using Microsoft.Net.Http.Headers;

namespace API.Extensions;

public static class HttpExtensions
{
    public static void AddPaginationHeader(this HttpResponse response, PaginationMetadata metadata)
    {
        // Serialize metadata to JSON using camelCase naming to match JS conventions
        var options = new JsonSerializerOptions{PropertyNamingPolicy = JsonNamingPolicy.CamelCase};
        // Add the serialized pagination info as a custom response header
        response.Headers.Append("Pagination", JsonSerializer.Serialize(metadata, options));
        // Make sure the "Pagination" header is exposed to the browser (for CORS requests)
        response.Headers.Append(HeaderNames.AccessControlExposeHeaders, "Pagination");
    }

}
