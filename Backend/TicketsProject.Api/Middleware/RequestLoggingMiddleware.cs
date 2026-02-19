using Serilog;
using System.Diagnostics;
using System.Security.Claims;

namespace TicketsProject.Api.Middlewares
{
    public sealed class RequestLoggingMiddleware
    {
        private readonly RequestDelegate _next;

        public RequestLoggingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var stopwatch = Stopwatch.StartNew();

            await _next(context); // let request run

            stopwatch.Stop();

            var userId = context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var role = context.User?.FindFirst(ClaimTypes.Role)?.Value;

            Log.Information("HTTP {Method} {Path} responded {StatusCode} in {Duration}ms | UserId={UserId} Role={Role}",
                context.Request.Method,
                context.Request.Path,
                context.Response.StatusCode,
                stopwatch.ElapsedMilliseconds,
                userId,
                role
            );
        }
    }
}
