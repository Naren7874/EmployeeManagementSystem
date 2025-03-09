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

//add cors
builder.Services.AddCors(
    opt =>
    {
        opt.AddPolicy("AllowCrossOrigin", policy =>
        {
            policy.AllowAnyOrigin();
            policy.AllowAnyHeader();
            policy.AllowAnyMethod();

        });
    }
    );
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(); 
}

app.UseCors("AllowCrossOrigin");
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
