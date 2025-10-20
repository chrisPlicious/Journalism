using JournalBackend.Data;
using JournalBackend.Models;
using JournalBackend.Services.Interfaces;
using JournalBackend.Services.Implementations;
using JournalBackend.Repositories.Interfaces;
using JournalBackend.Repositories.Implementations;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using AutoMapper;
using JournalBackend.Profiles;
using System.Text;
using System.IdentityModel.Tokens.Jwt;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAutoMapper(typeof(UserMappingProfile).Assembly);

// =================================================================================================
// 1. CONFIGURATION AND SETTINGS SETUP
// =================================================================================================

// Configure OpenAPI/Swagger
builder.Services.AddOpenApi();

// =================================================================================================
// 2. DATABASE AND ENTITY FRAMEWORK CONFIGURATION
// =================================================================================================

// Configure Entity Framework with SQL Server
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlServerOptions => sqlServerOptions.EnableRetryOnFailure()));

// Configure ASP.NET Core Identity
builder.Services.AddIdentity<User, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// =================================================================================================
// 3. AUTHENTICATION AND AUTHORIZATION SETUP
// =================================================================================================

// Configure JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultSignInScheme = "Identity.External";
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)),
        NameClaimType = JwtRegisteredClaimNames.Sub
    };
});

// =================================================================================================
// 4. SERVICE REGISTRATIONS (REPOSITORIES AND SERVICES)
// =================================================================================================

// Register repositories with their interfaces
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IJournalEntryRepository, JournalEntryRepository>();

// Register services with their interfaces
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IJournalService, JournalService>();

// =================================================================================================
// 5. MIDDLEWARE PIPELINE CONFIGURATION
// =================================================================================================

// Add MVC controllers
builder.Services.AddControllers();

// Configure CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Configure Swagger/OpenAPI
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Journal API", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter JWT with Bearer into field",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
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
            new string[] {}
        }
    });
});

// =================================================================================================
// 6. APPLICATION STARTUP
// =================================================================================================

var app = builder.Build();

// Run database migrations in development environment
if (app.Environment.IsDevelopment())
{
    try
    {
        using (var scope = app.Services.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            dbContext.Database.Migrate();
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Migration failed: {ex.Message}");
        // Continue startup even if migration fails
    }
}

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.UseCors("AllowFrontend");

app.Run();
