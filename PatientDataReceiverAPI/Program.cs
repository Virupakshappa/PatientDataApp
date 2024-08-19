using Microsoft.EntityFrameworkCore;
using Npgsql.EntityFrameworkCore.PostgreSQL;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();

// Configure DbContext to use YugabyteDB (PostgreSQL)
builder.Services.AddDbContext<PatientDataContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("YugabyteDBConnection")));

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        builder =>
        {
            builder.WithOrigins("http://localhost:3000")
                   .AllowAnyHeader()
                   .AllowAnyMethod()
                   .AllowCredentials(); // Allow credentials if needed
        });
});

var app = builder.Build();

// Use CORS middleware
app.UseCors();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();

app.UseRouting();

app.MapControllers();

app.Run();
