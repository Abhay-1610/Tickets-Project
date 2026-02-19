using System.Net;
using System.Text.Json;

namespace TicketsProject.Api.Middleware;

public sealed class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;

    public GlobalExceptionMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            context.Response.ContentType = "application/json";

            // Map exception → HTTP status
            context.Response.StatusCode = ex switch
            {
                UnauthorizedAccessException => (int)HttpStatusCode.Unauthorized,
                KeyNotFoundException => (int)HttpStatusCode.NotFound,
                ArgumentException => (int)HttpStatusCode.BadRequest,
                InvalidOperationException => (int)HttpStatusCode.Forbidden,
                _ => (int)HttpStatusCode.InternalServerError
            };

            // Standardized error payload
            var response = new ErrorResponse
            {
                Error = ex.Message,
                Code = GetErrorCode(ex)
            };

            await context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
    }

    // Converts exception → frontend-readable auth reason
    private static string GetErrorCode(Exception ex)
    {
        return ex switch
        {
            UnauthorizedAccessException when ex.Message.Contains("token", StringComparison.OrdinalIgnoreCase)
                => "token_expired",

            UnauthorizedAccessException when ex.Message.Contains("blocked", StringComparison.OrdinalIgnoreCase)
                => "user_blocked",

            UnauthorizedAccessException
                => "unauthorized",

            InvalidOperationException
                => "forbidden",

            ArgumentException
                => "bad_request",

            KeyNotFoundException
                => "not_found",

            _ => "server_error"
        };
    }

    private sealed class ErrorResponse
    {
        public string Error { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
    }
}
