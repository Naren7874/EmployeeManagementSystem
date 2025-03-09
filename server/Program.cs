using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using server.Data;
using server.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

//add dbcontext
builder.Services.AddDbContext<AppDbContext>(opt => opt
               .UseSqlServer(builder.Configuration
               .GetConnectionString("DefaultConnection")));

//add interface for dependency 
builder.Services.AddScoped<IRepository<Department> ,Repository<Department>>();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(); 
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
