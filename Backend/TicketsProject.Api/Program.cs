using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using System.Text.Json.Serialization;
using System.Security.Claims;
using System.Text;
using System.Threading.RateLimiting;
using TicketsProject.Api.Middleware;
using TicketsProject.Api.Middlewares;
using TicketsProject.Infrastructure;
using TicketsProject.Infrastructure.Roles;
using TicketsProject.Infrastructure.SignalR;
using System.Text.Json;



var builder = WebApplication.CreateBuilder(args);


// ======================================================
// Rate Limiting (Global)
// ======================================================
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    options.OnRejected = async (context, token) =>
    {
        context.HttpContext.Response.ContentType = "application/json";

        var response = new
        {
            error = "Too many requests.Stop Man !!!",
            code = "rate_limit_exceeded"
        };

        await context.HttpContext.Response.WriteAsync(
            JsonSerializer.Serialize(response),
            token);
    };

    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
    {
        var userId = httpContext.User?.FindFirstValue(ClaimTypes.NameIdentifier);

        var key = !string.IsNullOrWhiteSpace(userId)
            ? $"user:{userId}"
            : $"ip:{httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown"}";

        return RateLimitPartition.GetFixedWindowLimiter(
            key,
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 30,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0
            });
    });
});


// ======================================================
// Serilog
// ======================================================
Log.Logger = new LoggerConfiguration().MinimumLevel.Information()
    .WriteTo.File(
        path: "logs/requests/requests-.log",
        rollingInterval: RollingInterval.Day,      //
        retainedFileCountLimit: 5
    )
    .CreateLogger();

builder.Host.UseSerilog();




// ======================================================
// MediatR
builder.Services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssembly(
        typeof(TicketsProject.Application.AssemblyReference).Assembly));


// ======================================================
// Infrastructure DI  
builder.Services.AddInfrastructure(builder.Configuration);

// ======================================================
// Role Seeder
builder.Services.AddScoped<RoleSeeder>();


// ======================================================
// MVC + Swagger
// ======================================================
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(
        new JsonStringEnumConverter()
    );
});
builder.Services.AddSignalR()
    .AddJsonProtocol(options =>
    {
        options.PayloadSerializerOptions.Converters.Add(
            new JsonStringEnumConverter()
        );
    });

builder.Services.AddEndpointsApiExplorer();


// ======================================================
// JWT Auth
// ======================================================
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    var jwt = builder.Configuration.GetSection("Jwt");

    options.TokenValidationParameters = new()
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwt["SecretKey"]!)
        )
    };

    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];

            if (!string.IsNullOrEmpty(accessToken) &&
                context.HttpContext.Request.Path.StartsWithSegments("/hubs"))
            {
                context.Token = accessToken;
            }

            return Task.CompletedTask;
        }
    };
});


// ======================================================
// Swagger JWT Configuration
// ======================================================
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter JWT token as: Bearer {your token}"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});



 //======================================================
 //CORS(Frontend)
 //======================================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendCors", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
}); 

var app = builder.Build();

// ======================================================
// Pipeline
// ======================================================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ======================================================
// Role Seeding (Runs once on startup)
// ======================================================
using (var scope = app.Services.CreateScope())
{
    var roleSeeder = scope.ServiceProvider.GetRequiredService<RoleSeeder>();

    await roleSeeder.SeedAsync();
}

app.UseHttpsRedirection();

app.UseCors("FrontendCors");                          //Cors


app.UseAuthentication();  
app.UseAuthorization();    


app.UseRateLimiter();                               // global rate limit

app.UseMiddleware<RequestLoggingMiddleware>();      // Logging

app.UseMiddleware<GlobalExceptionMiddleware>();     // Exceptions

app.MapControllers();

app.MapHub<TicketHub>("/hubs/tickets");             //SignalR

app.Run();

