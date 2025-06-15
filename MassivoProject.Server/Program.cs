using Application.Interfaces;
using Application.Services;
using Domain.Interfaces;
using Infraestructure.Data;
using Infraestructure.Services;
using Infraestructure.Services.Infrastructure.Services;
using MassivoProject.Server.Exceptions;
using MassivoProject.Server.Middlewares;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
.AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;

});
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddHttpClient();


#region Swagger
builder.Services.AddSwaggerGen(setupAction =>
{
    setupAction.AddSecurityDefinition("MassivoApp", new OpenApiSecurityScheme() //Esto va a permitir usar swagger con el token.
    {
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        Description = "Ac� pegar el token generado al loguearse."
    });

    setupAction.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "MassivoApp" } //Tiene que coincidir con el id seteado arriba en la definici�n
                }, new List<string>() }
    });
});
#endregion

#region ContextDatabase
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));
#endregion

#region JWT

//JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer(options => 
    {
        options.TokenValidationParameters = new()
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["AutenticacionService:Issuer"],
            ValidAudience = builder.Configuration["AutenticacionService:Audience"],
            RoleClaimType = ClaimTypes.Role,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(builder.Configuration["AutenticacionService:SecretForKey"] ?? ""))
        };
    }
);
#endregion

#region Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IProvinceRepository, ProvinceRepository>();
builder.Services.AddScoped<ICityRepository, CityRepository>();
builder.Services.AddScoped<IVehicleRepository, VehicleRepository>(); 
builder.Services.AddScoped<IEventRepository, EventRepository>();
builder.Services.AddScoped<IBookingRepository, BookingRepository>();
builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();
builder.Services.AddScoped<IEventVehicleRepository, EventVehicleRepository>();
builder.Services.AddScoped<IReviewRepository, ReviewRepository>();

#endregion

#region Services
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IProvinceService, ProvinceService>();
builder.Services.AddScoped<ICityService, CityService>();
builder.Services.AddScoped<IVehicleService, VehicleService>();
builder.Services.AddScoped<IEventService, EventService>();
builder.Services.AddScoped<IBookingService, BookingService>();
builder.Services.AddScoped<IEventVehicleService, EventVehicleService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<IReviewService, ReviewService>();
builder.Services.AddScoped<IPaymentService, MercadoPagoService>();

// Authentification
builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();
//validador unicidad DNI y Email
builder.Services.AddScoped<IUserUniquenessChecker, UserUniquenessChecker>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("https://localhost:5173") 
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

#endregion

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

#region Exceptions
app.UseMiddleware<ExceptionHandlingMiddleware>();
#endregion

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
