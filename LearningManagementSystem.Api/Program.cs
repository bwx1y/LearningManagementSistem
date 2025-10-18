using LearningManagementSystem.Api.Configuration;
using LearningManagementSystem.Api.Extention;
using LearningManagementSystem.Application.Interface;
using LearningManagementSystem.Domain.Entity;
using LearningManagementSystem.Domain.Enum;
using LearningManagementSystem.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddJwtConfiguration(builder.Configuration);

builder.Services.AddDbContext<LmsDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ??
                           "Server=localhost;Database=LearningDB;Trusted_Connection=True;TrustServerCertificate=True;";
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AdaptApplicationServices();

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("ConfiguredCorsPolicy", policy =>
    {
        if (allowedOrigins != null)
            policy
                .WithOrigins(allowedOrigins)
                .AllowAnyMethod()
                .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("ConfiguredCorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var db  = scope.ServiceProvider.GetRequiredService<LmsDbContext>();
    var userService = scope.ServiceProvider.GetRequiredService<IUserService>();

    db.Database.EnsureCreated();

    if (app.Environment.IsDevelopment() && !db.User.Any(f => f.Email == "admin@gmail.com"))
    {
        Task.Run(async () =>
        {
           await userService.Create(new User
            {
                Email = "admin@gmail.com",
                Name = "Admin",
                Password = "admin",
                Role = Role.Admin
            });
        }).Wait();
    }
}

app.Run();