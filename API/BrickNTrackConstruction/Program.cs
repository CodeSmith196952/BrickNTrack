using BrickNTrack.Repository.Context;
using BrickNTrackConstruction.Core.Extension;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Net;

var builder = WebApplication.CreateBuilder(args);
var _configuration  = builder.Configuration;
ConfigurationServices(builder.Services);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    var key = builder.Configuration["JwtSettings:Key"];
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
        ValidAudience = builder.Configuration["JwtSettings:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key!))
    };
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

void ConfigurationServices(IServiceCollection services)
{
    services.AddAntiforgery(option =>
    {
        option.SuppressXFrameOptionsHeader = true;
    });
    services.AddDistributedMemoryCache();
    services.AddSession();
    services.AddCors(option =>
    {
        option.AddDefaultPolicy(

            builder =>
            {
                builder.AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
            });
    });


    //services.AddAutoMapper(typeof(Program));
    services.AddAutoMapper(typeof(Program));
    services.AddHttpContextAccessor();

    ServiceCollectionDIExtension.ConfigureServicesDependency(builder.Services);
    services.AddControllers();
    ConfigureDbContext(services);
}

void ConfigureDbContext(IServiceCollection services)
{
    services.AddDbContext<BrickNTrackContext>(options =>
    options.UseSqlServer(_configuration.GetConnectionString("DefaultConnection")));
}