var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// Add services to the container
builder.Services.AddControllers(); // Add support for controllers

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

// // Register DbContext
// builder.Services.AddDbContext<PatientDataContext>(options =>
//     options.UseNpgsql(builder.Configuration.GetConnectionString("YugaConnection")));

var app = builder.Build();

// Use CORS middleware
app.UseCors();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage(); // Show detailed error pages in development

}

app.UseHttpsRedirection();


app.UseRouting();

app.MapControllers();


app.Run();


