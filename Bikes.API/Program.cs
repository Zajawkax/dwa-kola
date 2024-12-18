using System;
using Bikes.Infrastructure;
using Bikes.Application.Bikes;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using MediatR;
using FluentValidation;
using FluentValidation.AspNetCore;
using System.Text.Json.Serialization;
using System.Text.Json;
using Bikes.API.Controllers;
using Bikes.Domain;
using Microsoft.AspNetCore.Identity;

var builder = WebApplication.CreateBuilder(args);

// Dodaj us³ugi do kontenera.
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
});

// Dodaj MediatR
builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(typeof(DetailsHandler).Assembly);
});



// Dodaj FluentValidation
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<CreateCommandValidator>();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
Console.WriteLine("Connection String: " + connectionString);

// Konfiguracja kontekstu bazy danych
builder.Services.AddDbContext<DataContext>(opt =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    opt.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 25)), b =>
        b.MigrationsAssembly("Bikes.Infrastructure"));
});


// Dodanie polityki CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});


// Konfiguracja Swaggera
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "Bikes API",
        Description = "API do zarz¹dzania rowerami",
        TermsOfService = new Uri("https://example.com/terms"),
        Contact = new OpenApiContact
        {
            Name = "Twoje Imiê",
            Email = "twojemail@example.com",
            Url = new Uri("https://example.com/contact")
        },
        License = new OpenApiLicense
        {
            Name = "Licencja MIT",
            Url = new Uri("https://opensource.org/licenses/MIT")
        }
    });
});
builder.Services.AddIdentityServices(builder.Configuration);

builder.Services.AddScoped<PasswordHasher<User>>();
builder.Services.AddScoped<TokenService>();
builder.Services.AddDbContext<DataContext>(opt =>
{
    opt.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
    new MySqlServerVersion(new Version(8, 0, 25)),
    b => b.MigrationsAssembly("Bikes.Infrastructure"));
});


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Bikes API v1");
        c.RoutePrefix = string.Empty;
    });
}
app.UseAuthentication();
app.UseAuthorization();
app.UseCors("CorsPolicy");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
