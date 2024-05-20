using Microsoft.EntityFrameworkCore;
using ConvertaApi.Data;
using ConvertaApi.Services;
using Microsoft.Extensions.DependencyInjection;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);
// builder.Services.AddDbContext<AdContext>(options =>
//     options.UseSqlServer(builder.Configuration.GetConnectionString("AdContext") ?? throw new InvalidOperationException("Connection string 'AdContext' not found.")));

// Add services to the container.

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower;
        options.JsonSerializerOptions.DictionaryKeyPolicy = JsonNamingPolicy.SnakeCaseLower;
        options.JsonSerializerOptions.WriteIndented = true;
        // Add more options as needed
    });

// Configure CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins",
        builder =>
        {
            builder.WithOrigins("http://localhost:3000", "http://localhost:3001")
                .AllowAnyMethod()
                .AllowAnyHeader();
        });
});

// Configure route options to be case-insensitive
builder.Services.AddRouting(options => 
{
    options.LowercaseUrls = true;
    options.LowercaseQueryStrings = true;
});

// builder.Services.AddDbContext<CampaignContext>(options =>
//     options.UseSqlServer(builder.Configuration.GetConnectionString("CampaignContext")));
builder.Services.AddDbContext<ConvertaContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PgSqlConnection")));
// builder.Services.AddDbContext<ConvertaContext>(options =>
//     options.UseSqlite(builder.Configuration.GetConnectionString("SqliteConnection")));
// builder.Services.AddDbContext<ConvertaContext>(options =>
//     options.UseInMemoryDatabase("Converta"));
Console.WriteLine($"Connection string: {builder.Configuration.GetConnectionString("PgSqlConnection")}");


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<ConvertaService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowSpecificOrigins");

app.UseAuthorization();

app.MapControllers();

app.Run();
